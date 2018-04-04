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

# Pre-releases are denoted with a - in the tag name (ie v2.0.1-prerelease, v2.0.1-beta.1).
if [[ $version = *-* ]]; then 
  # Publish a pre-release under the npm tag `next`. 
  # We are skpping the lerna git commands for pre-releases. The changelog command
  # diffs the last two lerna publish tags. Skipping git will generate the changelog
  # between the last two production releases rather than the last pre-release.
  yarn lerna publish --yes --skip-git --npm-tag=next --repo-version $version
else
  # Publish a new prudction release.
  # Re-fetch branch info: https://github.com/codeship/scripts/blob/master/deployments/git_push.sh
  git fetch --unshallow || true
  # Set the git user from env.
  git config user.name $GITHUB_USER
  git config user.email $GITHUB_EMAIL
  # Publish packages to npm, skipping git push because we do it right after over https.
  yarn lerna publish --yes --skip-git --repo-version $version
  # Only commit and publish back to repo if there are working copy changes.
  if [[ -n $(git status --porcelain) ]]; then
    # Commit the updated package versions to git
    git add .
    git commit -m "Publish $version [skip ci]"
    # Push updated package versions and tags back to the repo.
    git push --force --quiet --tags "https://${GITHUB_TOKEN}@${GITHUB_REPO}" master
  fi
  # Finally, deploy examples and docs.
  yarn deploy-examples
  yarn deploy-docs
fi

