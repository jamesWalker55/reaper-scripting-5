node := "bun"
tstl := "node_modules/typescript-to-lua/dist/tstl.js"

watch:
    just copy-files
    {{node}} "{{tstl}}" --watch

build:
    just copy-files
    {{node}} "{{tstl}}"

# Manually copy some files to dist
# Written by Gemini
copy-files:
    #!bash
    set -euxo pipefail

    # Define source and destination directories
    SRC_DIR="src"
    DST_DIR="dist"

    # Ensure the destination directory exists
    if [ ! -d "$DST_DIR" ]; then
        mkdir -p "$DST_DIR"
    fi

    # == Copy package.json

    # -f ensures it overwrites without prompting
    cp -f "package.json" "$DST_DIR/package.json"
    echo "package.json has been copied successfully."

    # == Copy declaration files

    # Find all .d.ts files in src recursively
    find "$SRC_DIR" -name "*.d.ts" -type f | while read -r file; do
        # Determine the relative path (remove src/ from the start)
        rel_path="${file#$SRC_DIR/}"

        # Determine destination path
        dst_path="$DST_DIR/$rel_path"

        # Ensure the destination directory exists
        dst_dir=$(dirname "$dst_path")
        if [ ! -d "$dst_dir" ]; then
            mkdir -p "$dst_dir"
        fi

        # Copy the file (overwriting if it exists)
        cp -f "$file" "$dst_path"
    done

    echo "All .d.ts files have been copied successfully."

    # == Copy plugins directory

    PLUGINS_SRC="plugins"
    # -r for recursive, -f for force/overwrite
    cp -rf "$PLUGINS_SRC" "$DST_DIR/"
    echo "The plugins directory has been copied successfully."