#!/bin/bash

FORCE=false
CI=false

for arg in "$@"; do
  if [ "$arg" == "--force" ]; then
    FORCE=true
  fi
  if [ "$arg" == "--ci" ]; then
    CI=true
  fi
done

create_npmrc() {
  if [ ! -f .npmrc ]; then
    touch .npmrc
  fi
  if grep -q "@fortawesome:registry" .npmrc && [ "$FORCE" = false ]; then
    echo "FONTAWESOME_KEY already exists in .npmrc";
    return 0;
  else
    echo "@fortawesome:registry=https://npm.fontawesome.com/
@awesome.me:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=$FONTAWESOME_KEY" > .npmrc
    echo ".npmrc created";
    return 0;
  fi
}

update_yarnrc() {
  if [ ! -f .yarnrc.yml ]; then
    YARN_VERSION=$(yarn --version 2>/dev/null || echo "${DEFAULT_YARN_VERSION}")
    cat <<EOL >.yarnrc.yml
nodeLinker: node-modules

npmScopes:
  fortawesome:
    npmAlwaysAuth: true
    npmRegistryServer: "https://npm.fontawesome.com/"
    npmAuthToken: "${FONTAWESOME_KEY}"
  awesome.me:
    npmAlwaysAuth: true
    npmRegistryServer: "https://npm.fontawesome.com/"
    npmAuthToken: "${FONTAWESOME_KEY}"
EOL
    echo ".yarnrc.yml created";
    return 0;
  fi
  if grep -q "npmAuthToken:" .yarnrc.yml && [ "$FORCE" = false ]; then
    echo "FONTAWESOME_KEY already exists in .yarnrc.yml";
    return 0;
  else
    if grep -q "npmAuthToken:" .yarnrc.yml; then
      sed -i "s/npmAuthToken: .*/npmAuthToken: \"${FONTAWESOME_KEY}\"/" .yarnrc.yml
      echo ".yarnrc.yml updated with new token";
    else
      cat <<EOL >>.yarnrc.yml
npmScopes:
  fortawesome:
    npmAlwaysAuth: true
    npmRegistryServer: "https://npm.fontawesome.com/"
    npmAuthToken: "${FONTAWESOME_KEY}"
  awesome.me:
    npmAlwaysAuth: true
    npmRegistryServer: "https://npm.fontawesome.com/"
    npmAuthToken: "${FONTAWESOME_KEY}"
EOL
      echo ".yarnrc.yml updated";
    fi
    return 0;
  fi
}

if [ -z "${FONTAWESOME_KEY}" ]; then
  echo "FONTAWESOME_KEY not set"; 
  exit 1;
fi

create_npmrc
CREATE_NPMRC=$?
update_yarnrc
UPDATE_YARNRC=$?
if [ $CREATE_NPMRC -eq 0 -a $UPDATE_YARNRC -eq 0 ]; then
  exit 0;
fi
if [ "$CI" = true ]; then
  echo "CI mode enabled, exiting without error";
  exit 0;
fi
exit 1;