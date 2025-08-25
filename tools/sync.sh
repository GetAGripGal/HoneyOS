#!/bin/bash
NODE_VERSION="v18.0.2"
HOSBUILD_LOCATION="src/tools/hosbuild"

# Install all node modules
npm install --prefix $HOSBUILD_LOCATION
