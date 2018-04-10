#!/bin/bash
set -e

echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
echo "unsafe-perm=true" >> ~/.npmrc

# We only want to release if the build was triggered by a Github release.
# Codeship sets CI_BRANCH if the build was triggered by pushing to a branch or a tag. 
# Abort the publish if CI_BRANCH doesn't start with `v` (ie. v2.0.1, v2.0.1-prerelease).
if [[ ${CI_BRANCH:0:1} != "v" ]]; then
  echo "Error publishing. Invalid version '$CI_BRANCH'"
  echo "The build was likely incorrectly triggered by a branch push instead of a Github release."
  exit 1
fi

# Trim the leading 'v' from the tag name and use it as the version
# TODO: validate version aheres to semver.
version=${CI_BRANCH:1}

echo "Building packages..."
# Build packages before publishing.
yarn build

# Pre-releases are denoted with a - in the tag name (ie v2.0.1-prerelease, v2.0.1-beta.1).
if [[ $version = *-* ]]; then 
  # Publish a pre-release under the npm tag `next`. 
  echo "Publishing $version pre-release..."
  yarn lerna publish --yes --skip-git --force-publish=* --npm-tag=next --repo-version $version
else
  # Publish a new prodction release.
  echo "Publishing $version release..."
  yarn lerna publish --yes --skip-git --force-publish=* --repo-version $version
  # We already built the examples with `yarn build`, now deploy them.
  yarn deploy-examples
  # Finally, build and deploy docs.
  # Gitbook can cause CI to fail randomly when building, if this happens
  # run the following commands locally from latest version of master.
  yarn build-docs
  yarn deploy-docs
fi

echo "Published."

