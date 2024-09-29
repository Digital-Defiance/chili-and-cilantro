#!/bin/bash
npm install -g yarn @nrwl/cli npx nx jest @withgraphite/graphite-cli@stable "$@"
if [ ! -z "$GRAPHITE_KEY" ]; then
  gt auth --token "${GRAPHITE_KEY}"
fi

sudo corepack enable
yarn set version 4.5.3