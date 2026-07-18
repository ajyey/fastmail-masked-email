# Changelog

## [4.0.0-beta.3](https://github.com/ajyey/fastmail-masked-email/compare/v4.0.0-beta.2...v4.0.0-beta.3) (2026-07-18)

### Bug Fixes

- **changelog:** normalize CHANGELOG formatting ([5a53db9](https://github.com/ajyey/fastmail-masked-email/commit/5a53db96d05487f8020b77c41ad55e43029f8756))
- **changelog:** normalize release heading levels ([7eb9e3c](https://github.com/ajyey/fastmail-masked-email/commit/7eb9e3c30fc95b269ecd079f391593fe523afdbc))

## [4.0.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2026-07-18)

### Bug Fixes

- **changelog:** fixes prettier errors ([c3a2e2d](https://github.com/ajyey/fastmail-masked-email/commit/c3a2e2dbf5ad34bdc175b91c14672f6b9708203f))
- **release:** require passing integration tests ([c68dab0](https://github.com/ajyey/fastmail-masked-email/commit/c68dab035839de77bff410aac783842a227cc03d))
- **ci:** use default Fastmail hostname ([8003a50](https://github.com/ajyey/fastmail-masked-email/commit/8003a509a19c4f5d0bf95d46741013e5c07716aa))

## [4.0.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v3.0.3...v4.0.0-beta.1) (2026-07-18)

### Bug Fixes

- **session:** accept standard JMAP account data ([fc62fea](https://github.com/ajyey/fastmail-masked-email/commit/fc62fea339d3f6c9cf15ce8dddf7ef7b2e91a5d8))

### Features

- **major:** modernize the library for v4 ([01f0023](https://github.com/ajyey/fastmail-masked-email/commit/01f0023e6a5bc8693572548ce9c6dca51a5f8a4f))

### BREAKING CHANGES

- **major:** v4 is ESM-only and introduces corrected service APIs.

Return contracts, JMAP validation, and public types changed. See MIGRATION.md.

## [3.0.3](https://github.com/ajyey/fastmail-masked-email/compare/v3.0.2...v3.0.3) (2026-07-14)

### Bug Fixes

- **jmap:** handle missing JMAP.CORE and missing list on get response ([59a59d1](https://github.com/ajyey/fastmail-masked-email/commit/59a59d180e5d61c6cc1fa63d63969df902e63332))

## [3.0.0-beta.3](https://github.com/ajyey/fastmail-masked-email/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2026-07-14)

### Bug Fixes

- **jmap:** handle missing JMAP.CORE and missing list on get response ([c1cf188](https://github.com/ajyey/fastmail-masked-email/commit/c1cf188f9fc6f15a97095364feef81d11de0b922))

## [3.0.2](https://github.com/ajyey/fastmail-masked-email/compare/v3.0.1...v3.0.2) (2025-11-03)

### Dependencies

- update production and development dependencies ([7411a1b](https://github.com/ajyey/fastmail-masked-email/commit/7411a1b38a05b277660c623769dd4fadaab8549e), [01274f9](https://github.com/ajyey/fastmail-masked-email/commit/01274f916a015c3d4fd625630a2b831544938375))

### Continuous Integration

- update GitHub Actions and move workflows to Node 24 ([e19410d](https://github.com/ajyey/fastmail-masked-email/commit/e19410dd966592659ca292142233e0fa5d9411ac))

## [3.0.1](https://github.com/ajyey/fastmail-masked-email/compare/v3.0.0...v3.0.1) (2025-09-25)

### Dependencies

- **axios:** bump the locked version from 1.10.0 to 1.12.2 ([70a8649](https://github.com/ajyey/fastmail-masked-email/commit/70a86497d12852f27666183d6e330a09bb3b8f6b))

## [3.0.0](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.15...v3.0.0) (2025-08-12)

### Features

- adds getSession method ([b0b3403](https://github.com/ajyey/fastmail-masked-email/commit/b0b3403f66a53190942be2688f423feb03c758b0))
- **major:** adds MaskedEmailService class ([9f3a5d8](https://github.com/ajyey/fastmail-masked-email/commit/9f3a5d85eff8e5bc7367061137adde69e89c3d03))

### BREAKING CHANGES

- **major:** Removes individual modules in favor of a MaskedEmailService class

## [3.0.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2025-08-12)

### Features

- adds getSession method ([b0b3403](https://github.com/ajyey/fastmail-masked-email/commit/b0b3403f66a53190942be2688f423feb03c758b0))

## [3.0.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.14-beta.1...v3.0.0-beta.1) (2025-08-12)

### Features

- **major:** adds MaskedEmailService class ([9f3a5d8](https://github.com/ajyey/fastmail-masked-email/commit/9f3a5d85eff8e5bc7367061137adde69e89c3d03))

### BREAKING CHANGES

- **major:** Removes individual modules in favor of a MaskedEmailService class

## [2.1.15](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.14...v2.1.15) (2025-08-12)

### Dependencies

- **form-data:** bump from 4.0.3 to 4.0.4 ([18958d3](https://github.com/ajyey/fastmail-masked-email/commit/18958d3c115d8147d85455cc50a0f8817334f5dd))

## [2.1.14](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.13...v2.1.14) (2025-06-18)

### Chores

- migrate the test suite from Jest to Vitest ([88978e7](https://github.com/ajyey/fastmail-masked-email/commit/88978e7f47876dcd5e82c7447e0716dfd061515b))
- update comments, formatting, lint configuration, and package metadata ([a052caa](https://github.com/ajyey/fastmail-masked-email/commit/a052caa7e4bf60d635cd17beed6c706e0f185061), [558e5d8](https://github.com/ajyey/fastmail-masked-email/commit/558e5d811af1c0cefd9613fa64b86a6a91ee0342), [7b8879b](https://github.com/ajyey/fastmail-masked-email/commit/7b8879b800c906059aed4e1a10b98b687ec46ae3), [9ce34c8](https://github.com/ajyey/fastmail-masked-email/commit/9ce34c8795f08ccddaf50f97b2fb873266545ad4), [c5fd584](https://github.com/ajyey/fastmail-masked-email/commit/c5fd584bd39481634c02552bbb1b8a64c5a2adfb))

### Dependencies

- update all packages and migrate to ESLint 9 ([7a63865](https://github.com/ajyey/fastmail-masked-email/commit/7a6386550a40197f4756ae47517c0c5092301f01))
- **eslint-plugin-tsdoc:** bump from 0.3.0 to 0.4.0 ([b6b5a84](https://github.com/ajyey/fastmail-masked-email/commit/b6b5a8489291864c8f7c41c9895e9a3e5ec4010a))

## [2.1.14-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.13...v2.1.14-beta.1) (2025-06-18)

### Chores

- migrate the test suite from Jest to Vitest ([88978e7](https://github.com/ajyey/fastmail-masked-email/commit/88978e7f47876dcd5e82c7447e0716dfd061515b))
- update comments, formatting, and lint configuration ([a052caa](https://github.com/ajyey/fastmail-masked-email/commit/a052caa7e4bf60d635cd17beed6c706e0f185061), [558e5d8](https://github.com/ajyey/fastmail-masked-email/commit/558e5d811af1c0cefd9613fa64b86a6a91ee0342), [7b8879b](https://github.com/ajyey/fastmail-masked-email/commit/7b8879b800c906059aed4e1a10b98b687ec46ae3), [9ce34c8](https://github.com/ajyey/fastmail-masked-email/commit/9ce34c8795f08ccddaf50f97b2fb873266545ad4))

### Dependencies

- update all packages and migrate to ESLint 9 ([7a63865](https://github.com/ajyey/fastmail-masked-email/commit/7a6386550a40197f4756ae47517c0c5092301f01))
- **eslint-plugin-tsdoc:** bump from 0.3.0 to 0.4.0 ([b6b5a84](https://github.com/ajyey/fastmail-masked-email/commit/b6b5a8489291864c8f7c41c9895e9a3e5ec4010a))

## [2.1.13](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.12...v2.1.13) (2025-04-25)

### Dependencies

- **axios:** bump from 1.7.7 to 1.9.0 ([ccd4f97](https://github.com/ajyey/fastmail-masked-email/commit/ccd4f97f4bcbd3a2e2b28b9a4b7f3a9749215534))

## [2.1.12](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.11...v2.1.12) (2025-04-16)

### Dependencies

- **debug:** bump from 4.3.4 to 4.4.0 ([8b882b6](https://github.com/ajyey/fastmail-masked-email/commit/8b882b64fa4f71aa85664d9e356b22ed33c1826a))
- update development dependencies ([1124e53](https://github.com/ajyey/fastmail-masked-email/commit/1124e53ef4236117b28c5bbed09801c9357b7eed), [76b402f](https://github.com/ajyey/fastmail-masked-email/commit/76b402f1cf4909898190054ccdda6f22a8cc44cd), [f18674a](https://github.com/ajyey/fastmail-masked-email/commit/f18674ae43a4f21f1515300919317b3389e8d66c), [fec0674](https://github.com/ajyey/fastmail-masked-email/commit/fec0674fe3423512bc2a5d29eb20b4408bf0eb7c), [ab40bf0](https://github.com/ajyey/fastmail-masked-email/commit/ab40bf0f8a2f7aaee2d8ca8417deec376f78f04f))

## [2.1.11](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.10...v2.1.11) (2024-09-15)

### Dependencies

- **axios:** bump from 1.7.2 to 1.7.7 ([ee78a14](https://github.com/ajyey/fastmail-masked-email/commit/ee78a145a072461fd822d2c3e39687ab72b0d809))

## [2.1.10](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.9...v2.1.10) (2024-09-11)

### Dependencies

- **axios:** bump from 1.7.2 to 1.7.4 ([8f86af1](https://github.com/ajyey/fastmail-masked-email/commit/8f86af1fe5eb310762f51e33058f84ff0abb5d6b))
- update development dependencies ([f24c3a6](https://github.com/ajyey/fastmail-masked-email/commit/f24c3a66191dddc6da76ae0b361f3a4577977d6a), [21fa559](https://github.com/ajyey/fastmail-masked-email/commit/21fa5590b6e5724e8341a355c28b66ffd92e460d), [9b099eb](https://github.com/ajyey/fastmail-masked-email/commit/9b099eb3868b8272eff1a574eeae1fdd8d366adc))

## [2.1.9](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.8...v2.1.9) (2024-06-12)

### Dependencies

- **tar:** bump from 6.1.15 to 6.2.1 ([a1225fe](https://github.com/ajyey/fastmail-masked-email/commit/a1225fef24d3c22daf7015e4117b48446b069355))
- update development dependencies ([cf5db8f](https://github.com/ajyey/fastmail-masked-email/commit/cf5db8ff5491d197ac0aa3311d1191cf61914fda), [1f9dd1f](https://github.com/ajyey/fastmail-masked-email/commit/1f9dd1fb261104239a254c8d4409aa5379e4d8be))

## [2.1.8](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.7...v2.1.8) (2024-06-12)

### Dependencies

- **axios:** bump from 1.6.8 to 1.7.2 ([8fb3f8a](https://github.com/ajyey/fastmail-masked-email/commit/8fb3f8a4e478328df39a8ab58f4506670f3bc2d4))
- update development dependencies ([ef73777](https://github.com/ajyey/fastmail-masked-email/commit/ef7377751d9220452e93a26a39bff6427e3970b2), [83b7478](https://github.com/ajyey/fastmail-masked-email/commit/83b74780ccc36b396ff26cb549f25ae7410737c8), [a1a7f17](https://github.com/ajyey/fastmail-masked-email/commit/a1a7f17ffcfb25e00f6fcd49fece4f5f9b0d0ced), [a5e25cf](https://github.com/ajyey/fastmail-masked-email/commit/a5e25cfaea87b12c10e18040b9418fb9d5a72495))

### Continuous Integration

- move GitHub Actions to Node 20 ([a860829](https://github.com/ajyey/fastmail-masked-email/commit/a8608299290d4b5fc11c13365a5c75b8a1e1599e))

## [2.1.7](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.6...v2.1.7) (2024-04-18)

### Dependencies

- **ip:** bump from 2.0.0 to 2.0.1 ([2a9a19a](https://github.com/ajyey/fastmail-masked-email/commit/2a9a19a3dbde3ff37c930af4b7b6f2f072ab67fb))
- update development dependencies ([c9ebf7b](https://github.com/ajyey/fastmail-masked-email/commit/c9ebf7b7df4cafadfc918373621c549a07624431), [7c60adf](https://github.com/ajyey/fastmail-masked-email/commit/7c60adfaee7dbfe8edc20eed31aed363c7e3b41d))

## [2.1.6](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.5...v2.1.6) (2024-04-15)

### Dependencies

- bump tar and npm ([bbf91c4](https://github.com/ajyey/fastmail-masked-email/commit/bbf91c4a12e5495e9d7cee76a41c906771c4bb32))
- update development dependencies ([e186423](https://github.com/ajyey/fastmail-masked-email/commit/e186423ff70ed8d66d7d10ab45c202e3456d26a8), [f707c17](https://github.com/ajyey/fastmail-masked-email/commit/f707c17d66e4b5d39ba315aafabed63575119749), [ac143b3](https://github.com/ajyey/fastmail-masked-email/commit/ac143b3a5a252f5e826284117b3b6b78e14f7acf))

## [2.1.5](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.4...v2.1.5) (2024-03-25)

### Dependencies

- **axios:** bump from 1.6.2 to 1.6.8 ([55f855e](https://github.com/ajyey/fastmail-masked-email/commit/55f855e88bc46ef532366d6d6f7974ab9bf94c01))
- update development dependencies ([236aaee](https://github.com/ajyey/fastmail-masked-email/commit/236aaeeccf36abda1f6446dc4717edd1b187e693), [b284748](https://github.com/ajyey/fastmail-masked-email/commit/b284748190f793ce37841e6711f0514ef17765cb), [30931d8](https://github.com/ajyey/fastmail-masked-email/commit/30931d87d7ed1c20cae7cb391e2ad105d26155dd))

## [2.1.4](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.3...v2.1.4) (2024-03-18)

### Dependencies

- **follow-redirects:** bump from 1.15.4 to 1.15.6 ([984e309](https://github.com/ajyey/fastmail-masked-email/commit/984e3096d3658cfbd1ba92af291fe45df3cba06f))
- update development dependencies ([81d1830](https://github.com/ajyey/fastmail-masked-email/commit/81d1830cdb28c4e4449f440427bbe6f7096c152d), [009ca73](https://github.com/ajyey/fastmail-masked-email/commit/009ca73dab9f6accc881a93a9cbcabba844df033), [4cbbe6c](https://github.com/ajyey/fastmail-masked-email/commit/4cbbe6cfb6dcb68ae562d28643d431ea451fd6c9))

## [2.1.3](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.2...v2.1.3) (2024-01-15)

### Dependencies

- **follow-redirects:** bump from 1.15.2 to 1.15.4 ([652d07f](https://github.com/ajyey/fastmail-masked-email/commit/652d07ff10629afbc22334c48db7bfc1f9c012fa))

## [2.1.2](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.1...v2.1.2) (2023-11-15)

### Dependencies

- **axios:** bump from 1.5.0 to 1.6.2 ([6e4cba1](https://github.com/ajyey/fastmail-masked-email/commit/6e4cba13eaba9da858afb2d9470c135e575d4f4f))
- update development dependencies ([9ac323d](https://github.com/ajyey/fastmail-masked-email/commit/9ac323d43e24117d267927f845666197defe6c58), [203b1ac](https://github.com/ajyey/fastmail-masked-email/commit/203b1ac0c9d575d2a4f1ffb8afc0f1405b8f861b), [858941b](https://github.com/ajyey/fastmail-masked-email/commit/858941b433108f79636fd3a18600419af00948b1))

## [2.1.1](https://github.com/ajyey/fastmail-masked-email/compare/v2.1.0...v2.1.1) (2023-09-25)

### Dependencies

- **axios:** bump from 1.4.0 to 1.5.0 ([c9989a7](https://github.com/ajyey/fastmail-masked-email/commit/c9989a732db60a2648ba3d11c9337a59128ccc43))
- update development dependencies ([33139ae](https://github.com/ajyey/fastmail-masked-email/commit/33139ae9e5670a6050366ef18a6dcb084c047725), [b37f463](https://github.com/ajyey/fastmail-masked-email/commit/b37f46378b9012737d53c0c4523f763346e6fcc6), [5cc5d4d](https://github.com/ajyey/fastmail-masked-email/commit/5cc5d4ddb8bc89b0b3fb3470b76a35390c56fd8d))

## [2.1.0](https://github.com/ajyey/fastmail-masked-email/compare/v2.0.1...v2.1.0) (2023-09-09)

### Features

- add emailPrefix ([#92](https://github.com/ajyey/fastmail-masked-email/issues/92)) ([b53b7b9](https://github.com/ajyey/fastmail-masked-email/commit/b53b7b90e16846abd0dbc9b7b3abde650badb844))

## [2.0.1](https://github.com/ajyey/fastmail-masked-email/compare/v2.0.0...v2.0.1) (2023-07-11)

### Dependencies

- **semver:** bump from 5.7.1 to 5.7.2 ([ad245f5](https://github.com/ajyey/fastmail-masked-email/commit/ad245f53f3d2c437e6d44f28b1817e1c246df6f3))

### Chores

- update and remove unused issue templates ([88763ac](https://github.com/ajyey/fastmail-masked-email/commit/88763ac467b91a82c7725640aa8a70eeb7857f99), [bf5ea3f](https://github.com/ajyey/fastmail-masked-email/commit/bf5ea3fb15467fb023b7875e1a9c059ea64f7eec))
- update development dependencies ([1667aac](https://github.com/ajyey/fastmail-masked-email/commit/1667aacb0cd8c149cdda8da13f06ce99c04114af), [1e27b9b](https://github.com/ajyey/fastmail-masked-email/commit/1e27b9b449299eea9a26dadd7bfc3ff9b7b4f7fd), [e1e6b07](https://github.com/ajyey/fastmail-masked-email/commit/e1e6b078756e414d77afeca18895cc75ee1f1dfa))

## [2.0.0](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.1...v2.0.0) (2023-07-04)

### Code Refactoring

- rename enable function to enableEmail ([b46b77c](https://github.com/ajyey/fastmail-masked-email/commit/b46b77cab4cb3beaee6bcba40c28546185c92c5e))
- **getByAddress:** rename getByAddress function ([731c7e1](https://github.com/ajyey/fastmail-masked-email/commit/731c7e18f48ecf1844b26526faab75f3b9010b1e))
- **getbyid:** rename getById function ([9ea778a](https://github.com/ajyey/fastmail-masked-email/commit/9ea778a07ca837a9fa9190b04e11369dc8d06f67))
- **create:** renames create function ([324a7af](https://github.com/ajyey/fastmail-masked-email/commit/324a7af8d72173a5417bc1e9d5a6a655500bfd29))
- renames disable function to disableEmail ([2e3feba](https://github.com/ajyey/fastmail-masked-email/commit/2e3feba0e3edd40a7afc05e978bd2e2b2118e4d9))
- renames remove method to deleteEmail ([2ae0df9](https://github.com/ajyey/fastmail-masked-email/commit/2ae0df97e8bda75560612c301ce643453993470c))
- **list:** renames the list function to getAllEmails ([d4cdbb0](https://github.com/ajyey/fastmail-masked-email/commit/d4cdbb0fb973b0de9dbb51f297208ef3d6f264b0))
- update function name change ([abaf4cf](https://github.com/ajyey/fastmail-masked-email/commit/abaf4cf08033d0d11792d84c98ab0aa9fca5634c))

### Features

- add function for permanently deleting a masked email ([b7df294](https://github.com/ajyey/fastmail-masked-email/commit/b7df2940d72c7fa756169803bf6976dc50a98a8e))

### BREAKING CHANGES

- rename enable function to enableEmail
- renames disable function to disableEmail
- renames the remove method to deleteEmail
- changes the update function to be updateEmail
- **getByAddress:** renames getByAddress to getEmailByAddress
- **create:** renames the create function to createEmail
- **getbyid:** renames getById to getEmailById
- **list:** rename list to getAllEmails

## [2.0.0-beta.5](https://github.com/ajyey/fastmail-masked-email/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2023-07-04)

### Features

- add function for permanently deleting a masked email ([b7df294](https://github.com/ajyey/fastmail-masked-email/commit/b7df2940d72c7fa756169803bf6976dc50a98a8e))

## [2.0.0-beta.4](https://github.com/ajyey/fastmail-masked-email/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2023-07-04)

### Code Refactoring

- rename enable function to enableEmail ([b46b77c](https://github.com/ajyey/fastmail-masked-email/commit/b46b77cab4cb3beaee6bcba40c28546185c92c5e))

### BREAKING CHANGES

- rename enable function to enableEmail

## [2.0.0-beta.3](https://github.com/ajyey/fastmail-masked-email/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2023-07-04)

### Code Refactoring

- renames disable function to disableEmail ([2e3feba](https://github.com/ajyey/fastmail-masked-email/commit/2e3feba0e3edd40a7afc05e978bd2e2b2118e4d9))

### BREAKING CHANGES

- renames disable function to disableEmail

## [2.0.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2023-07-04)

### Code Refactoring

- renames remove method to deleteEmail ([2ae0df9](https://github.com/ajyey/fastmail-masked-email/commit/2ae0df97e8bda75560612c301ce643453993470c))

### BREAKING CHANGES

- renames the remove method to deleteEmail

## [2.0.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.1...v2.0.0-beta.1) (2023-07-04)

### Code Refactoring

- update function name change ([abaf4cf](https://github.com/ajyey/fastmail-masked-email/commit/abaf4cf08033d0d11792d84c98ab0aa9fca5634c))
- **getByAddress:** rename getByAddress function ([731c7e1](https://github.com/ajyey/fastmail-masked-email/commit/731c7e18f48ecf1844b26526faab75f3b9010b1e))
- **create:** renames create function ([324a7af](https://github.com/ajyey/fastmail-masked-email/commit/324a7af8d72173a5417bc1e9d5a6a655500bfd29))
- **getbyid:** rename getById function ([9ea778a](https://github.com/ajyey/fastmail-masked-email/commit/9ea778a07ca837a9fa9190b04e11369dc8d06f67))
- **list:** renames the list function to getAllEmails ([d4cdbb0](https://github.com/ajyey/fastmail-masked-email/commit/d4cdbb0fb973b0de9dbb51f297208ef3d6f264b0))

### BREAKING CHANGES

- changes the update function to be updateEmail
- **getByAddress:** renames getByAddress to getEmailByAddress
- **create:** renames the create function to createEmail
- **getbyid:** renames getById to getEmailById
- **list:** rename list to getAllEmails

## [1.3.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.0...v1.3.1) (2023-05-24)

### Build System

- update dependency release rules and Dependabot configuration ([62d40a0](https://github.com/ajyey/fastmail-masked-email/commit/62d40a0dedeaf2e01e9b0fdcb4ded25896fda7c6), [912d1b7](https://github.com/ajyey/fastmail-masked-email/commit/912d1b724aa77ced5d0e752667ac1a118d134932), [f745a1e](https://github.com/ajyey/fastmail-masked-email/commit/f745a1e9557f9f5257a880ede10add37f52e3b33))

### Dependencies

- **@types/node:** bump from 18.16.14 to 20.2.3 ([e3ea13a](https://github.com/ajyey/fastmail-masked-email/commit/e3ea13a8e6d3cf43831820e472c45f147d8915bd))

## [1.3.0](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.3...v1.3.0) (2023-05-23)

### Bug Fixes

- entrypoint in package.json ([6cf5f5b](https://github.com/ajyey/fastmail-masked-email/commit/6cf5f5be63f6ebb1e8497ee162676d178b3976ed))

### Features

- **create:** add better axios error handling for creating masked emails ([35782b3](https://github.com/ajyey/fastmail-masked-email/commit/35782b39612300f52523228ddc95ccbd2ca3045c))
- **errors:** add util function for handling axios errors ([c560d4c](https://github.com/ajyey/fastmail-masked-email/commit/c560d4c9da169c815358cb7dfa9a1d9638ec203b))

## [1.3.0-beta.5](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.0-beta.4...v1.3.0-beta.5) (2023-05-23)

### Reverts

- Revert "fix: errors occurring due to axios being mocked" ([fa4c66d](https://github.com/ajyey/fastmail-masked-email/commit/fa4c66d02ecbc7b609220acede8456d93b2fc385))

## [1.3.0-beta.4](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.0-beta.3...v1.3.0-beta.4) (2023-05-23)

### Bug Fixes

- errors occurring due to axios being mocked ([6d158ca](https://github.com/ajyey/fastmail-masked-email/commit/6d158ca858cfecbd7c70cdc9085fcb514dce02ac))

## [1.3.0-beta.3](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.0-beta.2...v1.3.0-beta.3) (2023-05-23)

### Bug Fixes

- entrypoint in package.json ([6cf5f5b](https://github.com/ajyey/fastmail-masked-email/commit/6cf5f5be63f6ebb1e8497ee162676d178b3976ed))

## [1.3.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.0-beta.1...v1.3.0-beta.2) (2023-05-23)

### Features

- **errors:** add util function for handling axios errors ([c560d4c](https://github.com/ajyey/fastmail-masked-email/commit/c560d4c9da169c815358cb7dfa9a1d9638ec203b))

## [1.3.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.4-beta.2...v1.3.0-beta.1) (2023-05-23)

### Features

- **create:** add better axios error handling for creating masked emails ([35782b3](https://github.com/ajyey/fastmail-masked-email/commit/35782b39612300f52523228ddc95ccbd2ca3045c))

## [1.2.4-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.4-beta.1...v1.2.4-beta.2) (2023-05-23)

### Tests

- **axios:** create an explicit Axios mock ([a95d1f6](https://github.com/ajyey/fastmail-masked-email/commit/a95d1f6f906ed2b07f5d690f6d7ab8dcf7c9f1fe))

### Documentation

- **readme:** rearrange badges and add an Open in Visual Studio Code badge ([96ff71c](https://github.com/ajyey/fastmail-masked-email/commit/96ff71c04d4723876d8fffe84fa1dedc1ba680ad))

## [1.2.4-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.3...v1.2.4-beta.1) (2023-05-23)

### Code Refactoring

- simplify hostname and token handling in `getSession` ([9b38d36](https://github.com/ajyey/fastmail-masked-email/commit/9b38d3661ec04a917da7ef4698f39f42939800b5))

## [1.2.3](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.2...v1.2.3) (2023-05-23)

### Dependencies

- bump Debug and the TypeScript ESLint plugins ([41ae7b5](https://github.com/ajyey/fastmail-masked-email/commit/41ae7b57a47b5dab25b0a1fa398a1b3cdfa55dec))

## [1.2.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.1...v1.2.2) (2023-05-21)

### Bug Fixes

- bump eslint version ([ff6f76c](https://github.com/ajyey/fastmail-masked-email/commit/ff6f76c1cdea9bc8818bc9287e199bb9f8048edd))

## [1.2.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.0...v1.2.1) (2023-05-21)

### Documentation

- **readme:** document async/await usage and improve structure ([a4c256f](https://github.com/ajyey/fastmail-masked-email/commit/a4c256f2ece4e88d948a2adfe01053bf9db4de96))

### Chores

- remove parser options from the commit analyzer configuration ([0af6e51](https://github.com/ajyey/fastmail-masked-email/commit/0af6e51f52f38b60310263e2c3b4ea5831271331))

## [1.2.0](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.2...v1.2.0) (2023-05-20)

### Code Refactoring

- adds generic typing for jmap requests and responses ([af21328](https://github.com/ajyey/fastmail-masked-email/commit/af21328b1022a68d348483e785d9f41b11e010d1))

### Features

- condense create/update options types into a single options type ([2ad852d](https://github.com/ajyey/fastmail-masked-email/commit/2ad852d6a0359e752d761205b8b5182407c2531b))

### BREAKING CHANGES

- removes GetMethodResponse and SetMethodResponse types

## [1.2.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.0-beta.1...v1.2.0-beta.2) (2023-05-20)

### Code Refactoring

- adds generic typing for jmap requests and responses ([af21328](https://github.com/ajyey/fastmail-masked-email/commit/af21328b1022a68d348483e785d9f41b11e010d1))

### BREAKING CHANGES

- removes GetMethodResponse and SetMethodResponse types

## [1.2.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.2...v1.2.0-beta.1) (2023-05-19)

### Features

- condense create/update options types into a single options type ([2ad852d](https://github.com/ajyey/fastmail-masked-email/commit/2ad852d6a0359e752d761205b8b5182407c2531b))

## [1.1.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.1...v1.1.2) (2023-05-19)

### Documentation

- **readme:** fix a bad link and copy the logo into generated documentation ([6d50dcf](https://github.com/ajyey/fastmail-masked-email/commit/6d50dcf3548261945434e411a81252894bcaaa03))

## [1.1.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.0...v1.1.1) (2023-05-19)

### Documentation

- update the changelog and README layout and add release badges ([eadf941](https://github.com/ajyey/fastmail-masked-email/commit/eadf9415f349cbd13786ed5c7e39c27f5d5e5806), [5a88a5e](https://github.com/ajyey/fastmail-masked-email/commit/5a88a5e168264f0c6649bca5eb6452a9789a103b), [cd19984](https://github.com/ajyey/fastmail-masked-email/commit/cd199841962164edcc018fe447571532649b7b6d))

### Continuous Integration

- update workflow names ([0129446](https://github.com/ajyey/fastmail-masked-email/commit/0129446a40089865282064ef566e9c6ab5156568))

## [1.1.0](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0...v1.1.0) (2023-05-19)

### Features

- deleteEmail minor scope release rule ([91b2eb2](https://github.com/ajyey/fastmail-masked-email/commit/91b2eb2a60d2031ccaeeaa28f1b71dd3d7cc6646))

## [1.0.0](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-beta.2...v1.0.0) (2023-05-19)

### Features

- **minor:** add an explicit release rule for minor version bumps ([51c5707](https://github.com/ajyey/fastmail-masked-email/commit/51c57071c63b236cf79453b36154445c3aef0af8))

## [1.0.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-05-19)

### Documentation

- update the changelog format and remove alpha references from the README ([3caccfd](https://github.com/ajyey/fastmail-masked-email/commit/3caccfd48e656e63567a54688d9fa628e7a643f1), [3af7bcd](https://github.com/ajyey/fastmail-masked-email/commit/3af7bcd269e0c9500de8fe4881b3af9033da43f0))

### Chores

- add and normalize Semantic Release rules ([52055f5](https://github.com/ajyey/fastmail-masked-email/commit/52055f59465c04a19db7ba1ef11f6bbd679a9c40), [f820c21](https://github.com/ajyey/fastmail-masked-email/commit/f820c211050892da0fb2e2bc9a1df6fbc29079d7))

## [1.0.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-alpha.5...v1.0.0-beta.1) (2023-05-19)

### Features

- check the notFound field to determine if a masked email could not be found ([1988fab](https://github.com/ajyey/fastmail-masked-email/commit/1988fabaab2f45946efb7db291028d7db129591c))

## [1.0.0-alpha.5](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2023-05-17)

### Bug Fixes

- fix a typo ([04d3fbc](https://github.com/ajyey/fastmail-masked-email/commit/04d3fbc4297ed71c71eff12f2dfa3bd994d662af))

### Features

- add the initial session type ([3752139](https://github.com/ajyey/fastmail-masked-email/commit/3752139b349d0b3f64cc42bb6525e21e6cf1d1de))

### Code Refactoring

- refactor file names and update documentation ([87ecff3](https://github.com/ajyey/fastmail-masked-email/commit/87ecff37e7a53fd4fd744fb703c3f0d3a6bc4c0d))

### Tests

- add unit tests for session discovery ([e4dae35](https://github.com/ajyey/fastmail-masked-email/commit/e4dae35165f7a857605281431ede24e3828024f2))

### Documentation

- add alpha installation instructions and update documentation ([9c292ea](https://github.com/ajyey/fastmail-masked-email/commit/9c292ea4ed91b61beedaaf28c6b29828d4e60105), [56b3e50](https://github.com/ajyey/fastmail-masked-email/commit/56b3e50c243b3bbd0667d2b692607930683eeddf))

### Build System

- add Commitlint and Commitizen support ([23b811b](https://github.com/ajyey/fastmail-masked-email/commit/23b811b28c1a405d0cd2cd1a2a93be25bf9ad3e5))

## [1.0.0-alpha.4](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2023-05-06)

_No non-release changes._

## [1.0.0-alpha.3](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2023-05-06)

### Features

- reject invalid update options ([cf8cc91](https://github.com/ajyey/fastmail-masked-email/commit/cf8cc917cf922b80a4a550e620df4438ba29e105))

### Documentation

- update the changelog and add a TypeDoc link to the README ([6efe0ed](https://github.com/ajyey/fastmail-masked-email/commit/6efe0ed0c4522d8e098e74fc9b31eb56e39346bd), [0cfeae6](https://github.com/ajyey/fastmail-masked-email/commit/0cfeae6b1405b43e7cc88d4919faf29d687cf0dc))

### Chores

- update packages, Node.js, ESLint, ignore rules, and prerelease scripts ([8bbff32](https://github.com/ajyey/fastmail-masked-email/commit/8bbff326e247a62d3eb71702c0e05b1bbf2d00eb), [0246f53](https://github.com/ajyey/fastmail-masked-email/commit/0246f537a966ace29c372e3176200c21f19a2093), [52d1b8e](https://github.com/ajyey/fastmail-masked-email/commit/52d1b8ebd704655aa7cc704f4ec0c4f6d3dfe641), [db3cb05](https://github.com/ajyey/fastmail-masked-email/commit/db3cb05beabcc5b979c761435bf243e3071c0ff7), [3bd3260](https://github.com/ajyey/fastmail-masked-email/commit/3bd32607abb2fc923020b36a1f3070dc7d451342))

## [1.0.0-alpha.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2022-10-24)

### Added

- Better error types for invalid arguments and invalid credentials
- Much better typedoc descriptions and annotations
- Eslint plugin for tsdoc

## [1.0.0-alpha.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2022-10-17)

### Fixed

- Fixed a bug where the entry point was not being set correctly in the package.json file
- Fixed a bug where the `debug` package should have been a dependency instead of a devDependency

## [1.0.0-alpha.0](https://github.com/ajyey/fastmail-masked-email/releases/tag/v1.0.0-alpha.0) (2022-10-17)

### Added

- Initial package structure
- Initial barebones unit tests
  - Specifically for the 'getUtil' function
- Initial barebones fixtures
  - Specifically for masked email and session objects
- Initial documentation
- Initial barebones error handling
