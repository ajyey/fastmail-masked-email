# 1.0.0-beta.1 (2023-05-19)


### Features

* check the notFound field to determine if a masked email could not be found ([1988fab](https://github.com/ajyey/fastmail-masked-email/commit/1988fabaab2f45946efb7db291028d7db129591c))

# Changelog

All notable changes to `fastmail-masked-email` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- CONTRIBUTING.md guidelines
- ISSUE_TEMPLATE.md guidelines
- PULL_REQUEST_TEMPLATE.md guidelines
- Full unit test coverage
- Automated documentation generation and publishing
- Comprehensive error handling
- Automated release management

## [1.0.0-alpha.2] - 2022-10-24
### Added
- Better error types for invalid arguments and invalid credentials
- Much better typedoc descriptions and annotations
- Eslint plugin for tsdoc

## [1.0.0-alpha.1] - 2022-10-17
### Fixed
- Fixed a bug where the entry point was not being set correctly in the package.json file
- Fixed a bug where the `debug` package should have been a dependency instead of a devDependency

## [1.0.0-alpha.0] - 2022-10-17
### Added
- Initial package structure
- Initial barebones unit tests
  - Specifically for the 'getUtil' function
- Initial barebones fixtures
  - Specifically for masked email and session objects
- Initial documentation
- Initial barebones error handling
