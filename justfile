BASH_PATH := if os_family() == "windows" { "bash" } else { "/usr/bin/env bash" }
SCRIPT_HEADER := "set -euxo pipefail"

all:
  just json
  just reaper-api
  just reaper-microui
  just script-template
  just reaper-replacefx

json:
  #!{{BASH_PATH}}
  {{SCRIPT_HEADER}}

  cd lib/json
  bun link

reaper-api:
  #!{{BASH_PATH}}
  {{SCRIPT_HEADER}}

  cd lib/reaper-api
  rm -rf node_modules; bun install; just build
  cd './dist'; bun link

reaper-microui:
  #!{{BASH_PATH}}
  {{SCRIPT_HEADER}}

  cd lib/microui
  rm -rf node_modules; bun install; just build
  bun link

script-template:
  #!{{BASH_PATH}}
  {{SCRIPT_HEADER}}

  cd script-template
  rm -rf node_modules; bun install; just build

reaper-replacefx:
  #!{{BASH_PATH}}
  {{SCRIPT_HEADER}}

  cd reaper-replacefx
  rm -rf node_modules; bun install; just build
