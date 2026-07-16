# Repository Guide

## Commands

- Use Node 24 (the CI version) and install the npm lockfile with `npm ci`.
- Match CI with `npm test && npm run build`. `npm test` runs the Prettier check, ESLint, and all Vitest tests with V8 coverage; all four coverage thresholds are 95%.
- Run one file with `npx vitest run src/__tests__/MaskedEmailService.test.ts --coverage.enabled=false`; add `-t "test name"` for one case. Disable coverage for focused runs because the thresholds are global.
- Run a non-emitting typecheck with `npx tsc -p tsconfig.json --noEmit`.
- `npm run build` is mutating: it runs ESLint/Prettier fixes over `src` before deleting and rebuilding `dist`. Use `npm run build:compile` when source autofixes are not wanted.
- Generate docs non-interactively with `npm run doc:html`; `npm run doc` also opens a browser.
- Do not rely on `npm run start:dev`: `nodemon.json` invokes `ts-node`, but `ts-node` is not declared by this package.

## Code Map

- `src/index.ts` defines the published API. Export new public services, errors, and types there.
- `src/MaskedEmailService.ts` owns authentication, JMAP request construction, response parsing, and local filtering. Calls require `initialize()` first; initialization fetches the session whose `apiUrl` and account ID drive later requests.
- JMAP calls are invocation triples `[methodName, args, callId]` and must include both core and Fastmail masked-email capabilities from `src/constants.ts`. Tests assert complete Axios calls, including headers and request bodies.
- Unit tests mock Axios and need no Fastmail token or network. The constructor reads `JMAP_TOKEN` and `JMAP_HOSTNAME` directly from `process.env`; the library does not load `.env` itself.
- Tests and fixtures live under `src`, so TypeScript compiles them into `dist`; the `package.json` `files` exclusions keep them out of the published package. Do not edit generated `dist`, `docs`, or `coverage` output.

## Packaging And Release

- Module settings currently disagree: `package.json` declares `"type": "module"`, while `tsconfig.json` emits CommonJS `require`/`exports`. Test the packed artifact under Node before changing either setting or claiming module compatibility.
- Commit messages are checked against Conventional Commits. Semantic Release publishes stable releases from `master` and beta prereleases from `develop`.
