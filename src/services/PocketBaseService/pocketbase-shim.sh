#!/bin/sh

PBINCACHE=/.pbincache
CUSTOM_PB=/home/pockethost/pocketbase

# If there is a custom PocketBase, run it
if [ -d "${CUSTOM_PB}" ]; then
  # Forward all arguments to the specified version of pocketbase
  exec "${CUSTOM_PB}" "$@"
else
  # Set the version directory based on the environment variable
  VERSION_DIR="${PBINCACHE}/${PB_VERSION}/x64/linux"

  # Check if the specified version exists
  if [ -d "$VERSION_DIR" ]; then
    # Forward all arguments to the specified version of pocketbase
    exec "$VERSION_DIR/pocketbase" "$@"
  else
    echo "Error: Version $PB_VERSION not found."
    ls -lahR $PBINCACHE
    exit 1
  fi
fi

