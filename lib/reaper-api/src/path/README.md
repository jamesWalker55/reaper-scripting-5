# Partial port of os.path to Lua for Pandoc

This is a partial port of Python's `os.path` module to Lua, **for usage in Pandoc filters**. This should work in any system.

```lua
-- running on windows, linux is supported too
-- working directory is D:\foo\bar

local path = require("path.path")

path.relpath("relative", "../asd")
--> "..\bar\relative"

path.join("C:\\", "Program Files", "Git", "bin", "bash.exe")
--> "C:\Program Files\Git\bin\bash.exe"

path.normpath("/this\\is-a//\\/\\\\/REALLY BAD/path\\\\\\")
--> "\this\is-a\REALLY BAD\path"

path.abspath("../qwerty")
--> "D:\foo\qwerty"

path.split("a/b/c/d")
--> { "a/b/c", "d" }

path.splitdrive("C:\\qwerty")
--> { "C:", "\qwerty" }
```

## Implemented functions

Functions are implemented for both Windows and Unix systems, derived from `ntpath.py` and `posixpath.py` respectively:

- `relpath`\*
- `join`
- `normpath`
- `abspath`\*
- `normcase`
- `isabs`
- `splitext`
- `splitdrive`
- `split`

_\* Requires a Pandoc environment or a modified implementation of `#getcwd`, see next section_

All implemented functions are tested. The tests are ported from Python's test suite.

## Can I use this without Pandoc?

**Yes**, you just need to modify the `#getcwd` function inside `genericpath.lua`. Here's the source code:

```lua
-- genericpath.lua

--- Get the current working directory
--- There is no native function to do this, you MUST use an external library for this
function module.getcwd()
  assert(pandoc ~= nil, "#getcwd is only supported in a Pandoc environment")
  return pandoc.system.get_working_directory()
end
```

Native Lua lacks the ability to obtain the current working directory. However, Pandoc provides a function to obtain the working directory when running a script as a Lua filter, `pandoc.system.get_working_directory()`. This is used in `genericpath.lua`'s `#getcwd` function.

When not running in a Pandoc environment, `genericpath.lua`'s `#getcwd` will raise an error.

If you want to use this library outside a Pandoc environment, you need to modify the implementation of `#getcwd` to not rely on Pandoc.
