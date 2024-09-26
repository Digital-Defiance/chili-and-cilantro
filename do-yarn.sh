#!/bin/bash

# Find all package.json files, excluding node_modules, dist, and hidden directories
PACKAGE_ROOTS=$(find . -type f -name "package.json" ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/.*/*")

# Make sure we start with the project root
PROJECT_ROOT=$(pwd)

# Run yarn in the project root
echo "Running yarn in $PROJECT_ROOT"
yarn "$@"

# Loop through each package.json file
for PACKAGE in $PACKAGE_ROOTS; do
  # Get the directory containing the package.json file
  PACKAGE_DIR=$(dirname "$PACKAGE")
  
  # Skip the project root directory
  if [ "$PACKAGE_DIR" == "$PROJECT_ROOT" ]; then
    continue
  fi
  
  # Change to the package directory
  cd "$PACKAGE_DIR" || exit
  
  # Run yarn
  echo "Running yarn in $PACKAGE_DIR"
  yarn "$@"
  
  # Return to the project root directory
  cd "$PROJECT_ROOT" || exit
done