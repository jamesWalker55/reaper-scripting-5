--- A port of some functions from Python's os.path module

---@type string
local reaper_os = reaper.GetOS()
local is_windows = reaper_os:sub(1, 3) == "Win"

if is_windows then
  return require("ntpath")
else
  return require("posixpath")
end
