#!/bin/bash
set -euo pipefail

# Enable error reporting
trap 'echo "Error on line $LINENO. Exit code: $?" >&2' ERR

# Load NVM if available
if [ -s "$NVM_DIR/nvm.sh" ]; then
  echo "Loading NVM..."
  source "$NVM_DIR/nvm.sh"
else
  echo "Warning: NVM not found at $NVM_DIR/nvm.sh" >&2
fi

# Install and use Node version from .nvmrc if it exists
if [ -f .nvmrc ]; then
  echo "Found .nvmrc file, installing and using specified Node version..."
  nvm install
  nvm use
else
  echo "No .nvmrc file found, using current Node version"
fi

# Install npm dependencies if package.json exists
if [ -f package.json ]; then
  echo "Found package.json, installing dependencies..."
  npm install
else
  echo "No package.json found, skipping npm install"
fi

echo "Setup completed successfully!"
