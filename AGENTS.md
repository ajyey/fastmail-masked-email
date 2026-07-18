# Repository Guide

## Commands

- Use Node 24 for development and CI; the published ESM package supports Node 22 and later. Install with `npm ci`.
- Run the complete gate with `npm test && npm run build`. `npm test` checks formatting, lint, types, per-file coverage, the packed artifact, and TypeDoc.
- Run one test file with `npx vitest run src/__tests__/MaskedEmailService.test.ts --coverage.enabled=false`; add `-t "test name"` for one case.
- `npm run build` is non-mutating: it cleans `dist` and compiles only publishable source through `tsconfig.build.json`.
- `npm run test:package` builds and packs the library, validates it with Publint and Are The Types Wrong's ESM-only profile, then tests runtime and type consumers.
- `npm run test:integration` builds the package, then uses `JMAP_TOKEN` to exercise the live Fastmail lifecycle through the public ESM entrypoint. It creates and permanently deletes real addresses, is excluded from `npm test`, and must use a dedicated test account.
- Use `npm run dev` for Vitest watch mode and `npm run doc:html` for local API docs.

## Code Map

- `src/index.ts` is the only supported package entrypoint. Export public services, errors, and consumer types there; keep raw JMAP wire types internal.
- `src/MaskedEmailService.ts` owns session discovery, account selection, request validation, JMAP invocation parsing, and local filters. Remote methods require `initialize()`.
- Select accounts by the Fastmail masked-email capability, never by JMAP core alone. Writes must reject read-only accounts.
- JMAP calls use `[methodName, args, callId]`, require core and masked-email capabilities, and may return method errors with HTTP 200. Set operations also require checking `notCreated`, `notUpdated`, or `notDestroyed`.
- The constructor reads `JMAP_TOKEN` and `JMAP_HOSTNAME` directly; the package does not load `.env`. Tests inject an Axios client and need no token or network.
- Tests and fixtures remain under `src`, but the production build excludes them. Do not edit generated `dist`, `docs`, or `coverage` output.

## Packaging And Release

- v4 is ESM-only. Keep `package.json`, NodeNext TypeScript output, `.js` relative specifiers, declarations, and the `exports` map aligned.
- Validate consumer behavior against `npm pack`, not direct `dist` imports. CommonJS consumers must use dynamic `import()` as documented in `MIGRATION.md`.
- Commit messages use Conventional Commits. Semantic Release publishes stable releases from `master` and beta prereleases from `develop`.
- `.github/workflows/fastmail-integration-test.yml` runs the same live integration suite on pushes to `develop`/`master` and by manual dispatch. It requires a dedicated Fastmail token and must never run on pull requests or personal accounts.
