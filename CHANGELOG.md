# [1.3.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.3.0-beta.1...v1.3.0-beta.2) (2023-05-23)


### Features

* **errors:** add util function for handling axios errors ([c560d4c](https://github.com/ajyey/fastmail-masked-email/commit/c560d4c9da169c815358cb7dfa9a1d9638ec203b))

# [1.3.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.4-beta.2...v1.3.0-beta.1) (2023-05-23)


### Features

* **create:** add better axios error handling for creating masked emails ([35782b3](https://github.com/ajyey/fastmail-masked-email/commit/35782b39612300f52523228ddc95ccbd2ca3045c))

## [1.2.4-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.4-beta.1...v1.2.4-beta.2) (2023-05-23)

## [1.2.4-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.3...v1.2.4-beta.1) (2023-05-23)

## [1.2.3](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.2...v1.2.3) (2023-05-23)

## [1.2.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.1...v1.2.2) (2023-05-21)


### Bug Fixes

* bump eslint version ([ff6f76c](https://github.com/ajyey/fastmail-masked-email/commit/ff6f76c1cdea9bc8818bc9287e199bb9f8048edd))

## [1.2.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.0...v1.2.1) (2023-05-21)

# [1.2.0](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.2...v1.2.0) (2023-05-20)


### Code Refactoring

* adds generic typing for jmap requests and responses ([af21328](https://github.com/ajyey/fastmail-masked-email/commit/af21328b1022a68d348483e785d9f41b11e010d1))


### Features

* condense create/update options types into a single options type ([2ad852d](https://github.com/ajyey/fastmail-masked-email/commit/2ad852d6a0359e752d761205b8b5182407c2531b))


### BREAKING CHANGES

* removes GetMethodResponse and SetMethodResponse types

# [1.2.0-beta.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.2.0-beta.1...v1.2.0-beta.2) (2023-05-20)


### Code Refactoring

* adds generic typing for jmap requests and responses ([af21328](https://github.com/ajyey/fastmail-masked-email/commit/af21328b1022a68d348483e785d9f41b11e010d1))


### BREAKING CHANGES

* removes GetMethodResponse and SetMethodResponse types

# [1.2.0-beta.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.2...v1.2.0-beta.1) (2023-05-19)


### Features

* condense create/update options types into a single options type ([2ad852d](https://github.com/ajyey/fastmail-masked-email/commit/2ad852d6a0359e752d761205b8b5182407c2531b))

## [1.1.2](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.1...v1.1.2) (2023-05-19)

## [1.1.1](https://github.com/ajyey/fastmail-masked-email/compare/v1.1.0...v1.1.1) (2023-05-19)

# [1.1.0](https://github.com/ajyey/fastmail-masked-email/compare/v1.0.0...v1.1.0) (2023-05-19)


### Features

* remove minor scope release rule ([91b2eb2](https://github.com/ajyey/fastmail-masked-email/commit/91b2eb2a60d2031ccaeeaa28f1b71dd3d7cc6646))



# 1.0.0-beta.1 (2023-05-19)


### Features

* check the notFound field to determine if a masked email could not be found ([1988fab](https://github.com/ajyey/fastmail-masked-email/commit/1988fabaab2f45946efb7db291028d7db129591c))


# 1.0.0-alpha.2 (2022-10-24)
### Added
- Better error types for invalid arguments and invalid credentials
- Much better typedoc descriptions and annotations
- Eslint plugin for tsdoc

# 1.0.0-alpha.1 (2022-10-17)
### Fixed
- Fixed a bug where the entry point was not being set correctly in the package.json file
- Fixed a bug where the `debug` package should have been a dependency instead of a devDependency

# 1.0.0-alpha.0 (2022-10-17)
### Added
- Initial package structure
- Initial barebones unit tests
  - Specifically for the 'getUtil' function
- Initial barebones fixtures
  - Specifically for masked email and session objects
- Initial documentation
- Initial barebones error handling
