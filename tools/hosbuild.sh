#!/bin/bash
TOOL_LOCATION="src/tools/hosbuild"
WORKSPACE_DIR=$(pwd) npm run start --silent --prefix $TOOL_LOCATION $@
