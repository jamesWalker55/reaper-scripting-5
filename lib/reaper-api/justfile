tstl := "node_modules/typescript-to-lua/dist/tstl.js"

watch:
    just copy-files
    bun "{{tstl}}" --watch

build:
    just copy-files
    bun "{{tstl}}"

# Manually copy some files to dist
# Written by ChatGPT
copy-files:
    #!pwsh

    # Define source and destination directories
    $SRC_DIR = "src"
    $DST_DIR = "dist"

    # Ensure the destination directory exists
    if (-Not (Test-Path -Path $DST_DIR)) {
        New-Item -ItemType Directory -Path $DST_DIR
    }

    # == Copy package.json

    Copy-Item -Path "package.json" -Destination "$DST_DIR/package.json" -Force
    Write-Output "package.json has been copied successfully."

    # == Copy declaration files

    # Get all .d.ts files in the source directory
    $files = Get-ChildItem -Path $SRC_DIR -Recurse -Filter "*.d.ts"

    foreach ($file in $files) {
        # Determine the relative path of the file from the src dir
        $relPath = Resolve-Path -Path $file -Relative -RelativeBasePath $SRC_DIR

        # Determine the destination path
        $dstPath = Join-Path -Path $DST_DIR -ChildPath $relPath

        # Ensure the destination directory exists
        $dstDir = Split-Path -Path $dstPath -Parent
        if (-Not (Test-Path -Path $dstDir)) {
            New-Item -ItemType Directory -Path $dstDir -Force
        }

        # Copy the file using a hard link
        if (Test-Path -Path $dstPath) {
            Remove-Item -Path $dstPath -Force
        }
        New-Item -ItemType HardLink -Path $dstPath -Value $file.FullName
    }

    Write-Output "All .d.ts files have been copied successfully."

    # == Copy plugins directory

    $pluginsSrc = "plugins"
    $pluginsDst = "dist"

    Copy-Item -Path $pluginsSrc -Destination $pluginsDst -Recurse -Force
    Write-Output "The plugins directory has been copied successfully."

