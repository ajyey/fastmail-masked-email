# Contributing

## Setup

CI uses Node.js 24. The published package supports Node.js 22 and later. Use the
committed npm lockfile for a reproducible install:

```sh
npm ci
```

Do not commit API tokens. Unit tests mock Axios and require no Fastmail account
or network access.

## Validation

Before submitting a change, run the same primary checks as CI:

```sh
npm test
npm run build
```

`npm test` checks Prettier formatting, ESLint with zero warnings, a non-emitting
TypeScript build, Vitest with V8 coverage, the packed ESM package, and TypeDoc.
Coverage is measured per file with 95% minimums for branches, functions, lines,
and statements.

The package test builds and packs the project, runs `publint` and
`@arethetypeswrong/cli` with the ESM-only profile, rejects test artifacts in the
tarball, imports the installed tarball in Node, and type-checks a consumer with
both NodeNext and Bundler resolution.

`npm run build` deletes and recreates `dist`. Generated `dist`, `docs`, and
`coverage` output should not be edited by hand.

## Scripts

| Command                    | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `npm test`                 | Run every format, lint, type, unit, package, and docs check. |
| `npm run build`            | Clean `dist` and compile the publishable package.            |
| `npm run build:compile`    | Compile with `tsconfig.build.json` without cleaning first.   |
| `npm run clean`            | Remove `dist`.                                               |
| `npm run dev`              | Start Vitest in watch mode.                                  |
| `npm run doc`              | Generate HTML API documentation.                             |
| `npm run doc:html`         | Generate TypeDoc output in `docs` and copy the logo.         |
| `npm run fix`              | Apply ESLint fixes, then format the repository.              |
| `npm run format`           | Format the repository with Prettier.                         |
| `npm run format:check`     | Check repository formatting without writing.                 |
| `npm run lint`             | Run ESLint with zero warnings allowed.                       |
| `npm run lint:fix`         | Apply ESLint fixes.                                          |
| `npm run prepare`          | Install Husky Git hooks; npm invokes this lifecycle script.  |
| `npm run test:docs`        | Generate TypeDoc into a temporary directory.                 |
| `npm run test:integration` | Run the live Fastmail lifecycle suite with `JMAP_TOKEN`.     |
| `npm run test:package`     | Verify the built and packed ESM runtime and type package.    |
| `npm run test:unit`        | Run all Vitest tests with V8 coverage.                       |
| `npm run typecheck`        | Type-check with `tsconfig.json` without emitting files.      |

For a focused test, disable coverage because the thresholds are global:

```sh
npx vitest run src/__tests__/MaskedEmailService.test.ts --coverage.enabled=false
npx vitest run src/__tests__/MaskedEmailService.test.ts --coverage.enabled=false -t "test name"
```

The live integration suite is excluded from `npm test`. Run it only with a
dedicated Fastmail test account and a token with the Masked Email scope:

```sh
JMAP_TOKEN=your-test-token npm run test:integration
```

The command builds and type-checks the package before exercising its public ESM
entrypoint. The suite creates and permanently destroys two real masked emails.
The `fastmail-integration-test` GitHub workflow runs this same suite with
repository secrets on pushes to `develop` and `master`, or by manual dispatch.
It must never be enabled for pull requests or personal accounts.

## Changes

Keep public API changes exported from `src/index.ts` and add tests for behavior
and complete JMAP requests. Use Conventional Commit messages; commit messages
are checked by Commitlint. Stable releases are made from `master`, and beta
prereleases are made from `develop`.
