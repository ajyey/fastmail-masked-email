import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const bin = (name) =>
  join(
    root,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? `${name}.cmd` : name
  );
const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...options
  });

run(npm, ['run', 'build']);
run(bin('publint'), []);
run(bin('attw'), ['--pack', '.', '--profile', 'esm-only']);

const workspace = mkdtempSync(join(tmpdir(), 'fastmail-masked-email-package-'));
try {
  const packResult = JSON.parse(
    run(npm, [
      'pack',
      '--json',
      '--ignore-scripts',
      '--pack-destination',
      workspace
    ])
  )[0];
  const packedPaths = packResult.files.map(({ path }) => path);
  const unexpectedPath = packedPaths.find((path) =>
    /(?:__tests__|__fixtures__|\.test\.)/.test(path)
  );
  if (unexpectedPath) {
    throw new Error(
      `Published package contains test artifact: ${unexpectedPath}`
    );
  }

  writeFileSync(
    join(workspace, 'package.json'),
    JSON.stringify({ private: true, type: 'module' })
  );
  run(
    npm,
    [
      'install',
      '--ignore-scripts',
      '--no-package-lock',
      join(workspace, packResult.filename)
    ],
    {
      cwd: workspace
    }
  );

  writeFileSync(
    join(workspace, 'runtime.mjs'),
    "import { MaskedEmailService } from 'fastmail-masked-email';\nif (typeof MaskedEmailService !== 'function') process.exit(1);\n"
  );
  run(process.execPath, [join(workspace, 'runtime.mjs')], { cwd: workspace });

  writeFileSync(
    join(workspace, 'consumer.mts'),
    [
      "import { MaskedEmailService } from 'fastmail-masked-email';",
      "import type { MaskedEmail, MaskedEmailServiceOptions } from 'fastmail-masked-email';",
      "const options: MaskedEmailServiceOptions = { token: 'token' };",
      'const service = new MaskedEmailService(options);',
      'const email: MaskedEmail | undefined = undefined;',
      'const session = service.getSession();',
      '// @ts-expect-error Session snapshots are deeply readonly.',
      "session.accounts.example.name = 'changed';",
      'void service;',
      'void email;'
    ].join('\n')
  );

  const baseCompilerOptions = {
    noEmit: true,
    strict: true,
    target: 'ES2022',
    skipLibCheck: false
  };
  for (const [name, compilerOptions] of [
    [
      'nodenext',
      {
        ...baseCompilerOptions,
        module: 'NodeNext',
        moduleResolution: 'NodeNext'
      }
    ],
    [
      'bundler',
      { ...baseCompilerOptions, module: 'ESNext', moduleResolution: 'Bundler' }
    ]
  ]) {
    const configPath = join(workspace, `tsconfig.${name}.json`);
    writeFileSync(
      configPath,
      JSON.stringify({ compilerOptions, files: ['./consumer.mts'] })
    );
    run(
      process.execPath,
      [
        join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
        '-p',
        configPath
      ],
      {
        cwd: workspace
      }
    );
  }

  const manifest = JSON.parse(
    readFileSync(
      join(workspace, 'node_modules', 'fastmail-masked-email', 'package.json')
    )
  );
  if (manifest.type !== 'module' || manifest.exports?.['.']?.require) {
    throw new Error(
      'Packed package does not expose the expected ESM-only contract.'
    );
  }

  console.log(
    `Verified ${packResult.filename} as an ESM runtime and type package.`
  );
} finally {
  rmSync(workspace, { force: true, recursive: true });
}
