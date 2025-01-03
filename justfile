REAPER_INDEXER := "reapack-indexer-4"
INDEX_REPOSITORY := "D:/Programming/reaper-scripting-5-index"

BASH_PATH := if os_family() == "windows" { "bash" } else { "/usr/bin/env bash" }

rebuild:
  #!{{BASH_PATH}}
  set -euxo pipefail

  # store root dir to return to later
  WORKING_DIR=$(pwd)

  cd "$WORKING_DIR"
  cd lib/json
  bun link

  cd "$WORKING_DIR"
  cd lib/reaper-api
  rm -rf dist
  rm -rf node_modules; bun install; just build
  cd './dist'; bun link

  cd "$WORKING_DIR"
  cd lib/microui
  rm -rf build
  rm -rf node_modules; bun install; just build
  bun link

  cd "$WORKING_DIR"
  cd script-template
  rm -rf dist
  rm -rf node_modules; bun install; just build

  cd "$WORKING_DIR"
  cd fx-chunk-data
  rm -rf dist
  rm -rf node_modules; bun install; just build

publish package path:
  {{REAPER_INDEXER}} publish --repo "{{INDEX_REPOSITORY}}" --identifier "{{package}}" "{{path}}"

publish-new package path:
  {{REAPER_INDEXER}} publish --repo "{{INDEX_REPOSITORY}}" --identifier "{{package}}" "{{path}}" --new

reaper-path := "C:/Programs/REAPER Portable/reaper.exe"
reaper:
    "{{reaper-path}}" -newinst
