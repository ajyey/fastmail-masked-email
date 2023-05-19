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
