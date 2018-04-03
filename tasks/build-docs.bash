#!/bin/bash

# Gitbook will intermittently fail installing it's dependencies.
# See https://github.com/GitbookIO/gitbook/issues/1834.

# Install gitbook
yarn gitbook install

# Copy the local highlight.js to gitbook's node_modules.
cp -a node_modules/highlight.js/. ~/.gitbook/versions/3.2.3/node_modules/highlight.js/

# Build docs
yarn gitbook build
