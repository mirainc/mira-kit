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
  echo "Publishing pre-release: $version"
  yarn lerna publish --yes --skip-git --npm-tag=next --repo-version $version
else
  # Publish a new prudction release.
  # Force the origin url to use HTTPS when fetching and pushing.
  git remote set-url origin https://${GITHUB_TOKEN}@${GITHUB_REPO}
  # Make sure we fetch all branches, Codeship by default will only fetch the branch that triggered the build. 
  git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
  echo "Fetching from $GITHUB_REPO"
  # Re-fetch branch info: https://github.com/codeship/scripts/blob/master/deployments/git_push.sh
  git fetch --quiet --unshallow origin || true
  # Checkout master to make sure we are on the correct branch and that we've successfully pulled from origin.
  echo "Checking out master"
  git checkout master
  # Set the git user from env.
  git config user.name $GITHUB_USER
  git config user.email $GITHUB_EMAIL
  echo "Publishing release: $version"
  # We skip the git commands because we do them ourselves below to make sure we push over HTTPS
  # to avoid SSH fingerprint prompts. 
  # We force publish because we are using Github releases to trigger the build, which already 
  # creates the new tag. This causes Lerna to incorrectly determine there are no changes
  # to publish so we need force it (causing it to skip the update check).
  yarn lerna publish --yes --skip-git --force-publish=* --repo-version $version
  # Only commit and publish back to the repo if there are working copy changes.
  if [[ -n $(git status --porcelain) ]]; then
    echo "Committing changes:"
    echo "$(git status --porcelain)"
    # Commit the updated package versions to git
    git add --all
    git commit -m "Publish $version [skip ci]"
    echo "Pushing changes to $GITHUB_REPO"
    # Push updated package versions and tags back to the repo.
    git push --force --quiet origin master
  else
    echo "No working copy changes, skipping git commands."
  fi
  # We need to build all packages, examples and docs before we can deploy.
  yarn build
  yarn build-examples
  yarn build-docs
  # Finally, deploy examples and docs.
  yarn deploy-examples
  yarn deploy-docs
fi

