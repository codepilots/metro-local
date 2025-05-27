# Metro

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/metro/blob/HEAD/LICENSE)
[![npm package version](https://img.shields.io/npm/v/metro?color=brightgreen)](https://www.npmjs.com/package/metro)
[![facebook/metro/nightly-tests](https://github.com/facebook/metro/actions/workflows/nightly-tests.yml/badge.svg)](https://github.com/facebook/metro/actions/workflows/nightly-tests.yml)
[![Code coverage](https://codecov.io/gh/facebook/metro/branch/main/graph/badge.svg?token=oMHdoKhFZB)](https://codecov.io/gh/facebook/metro)
[![Follow @MetroBundler on Twitter](https://img.shields.io/twitter/follow/MetroBundler?style=social)](https://twitter.com/intent/follow?screen_name=MetroBundler)

🚇 The JavaScript bundler for React Native.

- **🚅 Fast**: We aim for sub-second reload cycles, fast startup and quick bundling speeds.
- **⚖️ Scalable**: Works with thousands of modules in a single application.
- **⚛️ Integrated**: Supports every React Native project out of the box.

## Installation

Metro is included with React Native — see the [React Native docs](https://reactnative.dev/docs/getting-started) to quickly get started ⏱️.

To add Metro to an existing project, see our [Getting Started guide](https://metrobundler.dev/docs/getting-started).

## Documentation

All available documentation, including on [configuring Metro](https://metrobundler.dev/docs/configuration), can be found on the [Metro website](https://metrobundler.dev/docs/getting-started).

Source code for documentation is located in this repository under `docs/`.

## Contributing

Metro was previously part of the [react-native](https://github.com/facebook/react-native) repository. In this standalone repository it is easier for the team working on Metro to respond to issues and pull requests. See [react-native#13976](https://github.com/facebook/react-native/issues/13976) for the initial announcement.

### [Code of Conduct](https://code.fb.com/codeofconduct)

Meta has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://code.fb.com/codeofconduct) so that you can understand what actions will and will not be tolerated.

### [Contributing guide](https://github.com/facebook/metro/blob/main/CONTRIBUTING.md)

Read our [contributing guide](https://github.com/facebook/metro/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes to Metro.

### Discussions

Larger discussions and proposals concerning React Native and Metro are discussed in [**@react-native-community/discussions-and-proposals**](https://github.com/react-native-community/discussions-and-proposals).

## License

Metro is MIT licensed, as found in the LICENSE file.

## Reverse Proxy and `baseUrl` Support

This is exploritory functionalityby @codepilots. It may or may not work, use at your own risk!

### Overview
This fork adds robust support for running Metro behind a reverse proxy by introducing a configurable `baseUrl` option. All URLs and file paths served by the Metro server—including bundles, source maps, HMR, delta, assets, symbolicate, and all other endpoints—are now correctly prefixed with the configured `baseUrl`. This ensures Metro can be hosted at a non-root path and all outgoing URLs and endpoint routing will work as expected.

### Approach
- **Configurable `baseUrl`**: The server reads a `baseUrl` from the config and uses it to prefix all served URLs and endpoint matches.
- **Endpoint Routing**: All endpoint handlers in `Server.js` use utilities to strip or add the `baseUrl` for correct internal routing and external URL generation.
- **Outgoing URLs**: All outgoing URLs in responses (such as asset metadata, bundle URLs, source maps, and module source URLs in source maps and error stacks) are generated with the `baseUrl` prefix.
- **Asset Metadata**: The `.assets` endpoint and asset metadata now use the baseUrl-prefixed `/assets` as their `publicPath`.
- **Source Maps**: Module source URLs in source maps are baseUrl-prefixed when using server-relative paths.
- **HMR and Async Split Bundles**: All dynamic bundle URLs are constructed with the `baseUrl`.

### Key Changes
- Added `_prefixWithBaseUrl` and `_stripBaseUrl` utilities in `Server.js` for consistent path handling.
- Updated all endpoint routing and outgoing URL generation to use these utilities.
- Ensured asset metadata and module source URLs are always baseUrl-aware.
- Updated HMR and async split bundle URL construction to use `baseUrl`.
- All changes are Flow-typed and maintain compatibility with the existing Metro codebase.

### Usage
To use Metro behind a reverse proxy, set the `baseUrl` option in your Metro config:

```js
// metro.config.js
module.exports = {
  baseUrl: '/my/proxy/path',
  // ...other config
};
```

All served URLs and endpoint routing will now respect this baseUrl.

---
