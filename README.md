# MiraKit

[![npm](https://img.shields.io/npm/v/mira-kit.svg)](https://www.npmjs.com/package/mira-kit) [![Codeship](https://img.shields.io/codeship/c58d4e70-9d48-0134-e482-0ad6b5578a26/master.svg)](https://app.codeship.com/projects/188612)

MiraKit is [Mira's](https://getmira.com) screen signage SDK. Mira apps are offline-first React applications that can be configured and published through the [Mira Dashboard](https://dash.getmira.com).

Inspired by [create-react-app](https://github.com/facebook/create-react-app), MiraKit makes it easy to develop screen signage applications with zero build configuration.

---

[Documentation](https://mirainc.github.io/mira-kit/)

Demos:
[Video Player](https://mira-kit-video-example.netlify.com) ·
[Weather](https://mira-kit-weather-example.netlify.com) ·
[Menu](https://mira-kit-menu-example.netlify.com)

---

## Contributing

This repo uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

After cloning the repository, running `yarn` will install and link all packages and examples.

### Packages

##### `create-mira-app`

The globally installed cli used to bootstrap a new Mira app. Installs the latest `mira-scripts` and `mira-kit` locally and runs the `init` script.

##### `mira-kit`

Common components used for building apps and prop-types.

##### `mira-resources`

Sandboxing utilities for `fetch` and allowed request domains.

##### `mira-scripts`

The development scripts for running the simulator and deploying a Mira apps.

##### `mira-simulator`

The simulator wrapper component and distributable for serving the app preview in development.

##### Adding a dependency to a package

`yarn workspace mira-scripts add <package-name>`

### Publishing

Pushing to master will trigger a pre-release. The latest versions of the packages will be published to npm with the `next` tag (ie. `npx create-mira-app@next my-mira-app`).

To publish a new release:

1.  Create a new [Github release](https://github.com/mirainc/mira-kit/releases).
2.  Name the release with the new version (eg. `v2.1.0`). For pre-releases append `-<name>` to the tag (ie. `v2.1.0-beta.0`).
3.  Checkout the latest version of `master` locally.
4.  Generate a changelog locally with `GITHUB_AUTH=<token> yarn changelog`. You will need to [generate a personal access token](https://github.com/settings/tokens) with a `repo` scope if you don't have one.
5.  Paste the change log into the release notes.
