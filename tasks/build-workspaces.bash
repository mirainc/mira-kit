#!/bin/bash
set -e

# We aren't using lerna run build here because we need the builds
# to happen in a specific order.

# First we need to build packages
cd packages/mira-kit
yarn build
cd ../mira-resources
yarn build
cd ../mira-simulator
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