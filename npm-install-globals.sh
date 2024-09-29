#!/bin/bash
yes | npm install -g yarn @nrwl/cli nx jest @withgraphite/graphite-cli@stable --force "$@"
if [ ! -z "$GRAPHITE_KEY" ]; then
  npx @withgraphite/graphite-cli@stable auth --token "${GRAPHITE_KEY}"
fi

sudo corepack enable
yarn set version 4.5.3