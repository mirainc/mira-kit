#!/bin/bash
set -e

echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc

chown -R root /usr/local

npm publish
