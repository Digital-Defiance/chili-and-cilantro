#!/bin/bash
# change directories into the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR
npx nx reset
rm -rf dist node_modules ./chili-and-cilantro-lib/node_modules ./chili-and-cilantro-node-lib/node_modules
./do-yarn.sh