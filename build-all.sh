#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd "$SCRIPT_DIR/lib/json"
bun link

cd "$SCRIPT_DIR/lib/reaper-api"
rm -rf node_modules; bun install; just build
cd './dist'; bun link

cd "$SCRIPT_DIR/lib/microui"
rm -rf node_modules; bun install; just build
bun link

cd "$SCRIPT_DIR/script-template"
rm -rf node_modules; bun install; just build

cd "$SCRIPT_DIR/reaper-replacefx"
rm -rf node_modules; bun install; just build
