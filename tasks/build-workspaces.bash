#!/bin/bash
set -e

# We aren't using lerna run build here because we need the builds
# to happen in a specific order.

# First we need to build packages
cd packages/raydiant-kit
yarn build
cd ../raydiant-mock-device
yarn build
cd ../raydiant-resources
yarn build
cd ../raydiant-simulator
yarn build

# Now build the examples
cd ../../examples/menu
yarn build
yarn static
cd ../video-player
yarn build
yarn static
cd ../weather
yarn build
yarn static