# Contributing

This repo uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

After cloning the repository, running `yarn` will install and link all packages and examples.

## Packages

##### `create-raydiant-app`

The globally installed cli used to bootstrap a new Mira app. Installs the latest `raydiant-scripts` and `raydiant-kit` locally and runs the `init` script.

##### `raydiant-kit`

Common components used for building apps and prop-types.

##### `raydiant-resources`

Sandboxing utilities for `fetch` and allowed request domains.

##### `raydiant-scripts`

The development scripts for running the simulator and deploying a Mira apps.

##### `raydiant-simulator`

The simulator wrapper component and distributable for serving the app preview in development.

##### Adding a dependency to a package

`yarn workspace raydiant-scripts add <package-name>`

## Publishing

Creating a pre-release (ie. `v2.0.5-beta.1`) will publish packages to npm under the `next` tag. Creating a new release (ie. `v2.0.5`) will publish all packages, examples and documentation.

To publish a new release:

1.  Run `yarn bump-version` from your branch to update the package.json versions.
2.  Commit the changes with a commit message of the new version number (ie. `Publish v2.0.1`).
3.  Create a PR to master with the updated version numbers.
4.  Merge PR into master.
5.  Create a new [Github release](https://github.com/mirainc/mira-kit/releases) from master.
6.  Name the release with the new version (eg. `v2.1.0`). For pre-releases append `-<name>` to the tag (ie. `v2.1.0-beta.0`).
7.  Checkout master locally and fetch the latest tags with `git fetch`.
8.  Generate a changelog locally with `GITHUB_AUTH=<token> yarn changelog --tag-from <previous-tag> --tag-to <new-tag>`. You will need to [generate a personal access token](https://github.com/settings/tokens) with a `repo` scope if you don't have one.
9.  Paste the change log into the release notes.
