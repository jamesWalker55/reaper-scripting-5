-- port of os.path for Windows

local util = require("util")
local common = require("genericpath")

local getcwd = common.getcwd
local contains = util.contains

local module = {}

function module.splitext(p)
  return common.splitext(p, "\\", "/", ".")
end

--- @param path string
function module.splitdrive(path)
  if #path >= 2 then
    -- normalized path, by replacing all forward slashes with backslashes
    local npath = path:gsub("/", "\\")
    if npath:sub(1, 2) == "\\\\" and npath:sub(3, 3) ~= "\\" then
      -- this is a UNC path (starts with 2 backslashes)

      -- |---drive letter---|
      -- \\machine\mountpoint\directory\etc\...
      --                     |---directory----|

      local first_sep = npath:find("\\", 3)
      if first_sep == nil then
        return "", path
      end

      -- a UNC path can't have 2 slashes in a row (other than the first two)
      local second_sep = npath:find("\\", first_sep + 1)
      if second_sep == first_sep + 1 then
        return "", path
      end

      if second_sep == nil then
        return path, ""
      else
        return path:sub(1, second_sep - 1), path:sub(second_sep)
      end
    end

    if path:sub(2, 2) == ":" then
      return path:sub(1, 2), path:sub(3)
    end
  end

  return "", path
end

function module.join(path, ...)
  local paths = { ... }

  local result_drive, result_path = module.splitdrive(path)

  -- iterate for 2nd path onwards
  for _, p in ipairs(paths) do
    local p_drive, p_path = module.splitdrive(p)
    if #p_path > 0 and contains(p_path:sub(1, 1), { "\\", "/" }) then
      -- second path is absolute
      if #p_drive > 0 or #result_drive == 0 then
        result_drive = p_drive
      end

      result_path = p_path
      goto continue
    elseif #p_drive > 0 and p_drive ~= result_drive then
      if p_drive:lower() ~= result_drive:lower() then
        -- Different drives => ignore the first path entirely
        result_drive = p_drive
        result_path = p_path
        goto continue
      end
      -- Same drive in different case
      result_drive = p_drive
    end
    -- Second path is relative to the first
    if #result_path > 0 and not contains(result_path:sub(-1, -1), { "\\", "/" }) then
      result_path = result_path .. "\\"
    end
    result_path = result_path .. p_path
    ::continue::
  end
  -- add separator between UNC and non-absolute path
  if
    #result_path > 0
    and not contains(result_path:sub(1, 1), { "\\", "/" })
    and #result_drive > 0
    and result_drive:sub(-1, -1) ~= ":"
  then
    return result_drive .. "\\" .. result_path
  end

  return result_drive .. result_path
end

-- Normalize a path, e.g. A//B, A/./B and A/foo/../B all become A\B.
-- Previously, this function also truncated pathnames to 8+3 format,
-- but as this module is called "ntpath", that's obviously wrong!

--- Normalize path, eliminating double slashes, etc.
function module.normpath(path)
  if contains(path:sub(1, 4), { [[\\.\]], [[\\?\]] }) then
    -- in the case of paths with these prefixes:
    -- \\.\ -> device names
    -- \\?\ -> literal paths
    -- do not do any normalization, but return the path
    -- unchanged apart from the call to os.fspath()
    return path
  end

  path = path:gsub("/", "\\")
  local prefix, path = module.splitdrive(path)

  -- collapse initial backslashes
  if path:sub(1, 1) == "\\" then
    prefix = prefix .. "\\"

    path = ({ path:gsub("^\\+", "") })[1]
  end

  -- split by separator into list
  local comps = util.split(path, "[^\\\\]*")
  local i = 1
  while i <= #comps do
    if #comps[i] == 0 or comps[i] == "." then
      table.remove(comps, i)
    elseif comps[i] == ".." then
      if i > 1 and comps[i - 1] ~= ".." then
        for _ = 0, 1 do -- do twice
          table.remove(comps, i - 1)
        end
        i = i - 1
      elseif i == 1 and prefix:sub(-1, -1) == "\\" then
        table.remove(comps, i)
      else
        i = i + 1
      end
    else
      i = i + 1
    end
  end
  -- If the path is now empty, substitute '.'
  if #prefix == 0 and #comps == 0 then
    comps[#comps + 1] = "."
  end
  return prefix .. table.concat(comps, "\\")
end

--- Split a pathname.
--- Return tuple (head, tail) where tail is everything after the final slash.
--- Either part may be empty.
--- @param p string
function module.split(p)
  local d, p = module.splitdrive(p)
  -- set i to index beyond p's last slash
  local i = #p + 1
  while i ~= 1 and not contains(p:sub(i - 1, i - 1), { "/", "\\" }) do
    i = i - 1
  end
  local head, tail = p:sub(1, i - 1), p:sub(i) -- now tail has no slashes
  -- remove trailing slashes from head, unless it's all slashes
  -- https://stackoverflow.com/questions/17386792/how-to-implement-string-rfind-in-lua
  head = head:match("(.*[^/\\])") or head
  return d .. head, tail
end

--- Test whether a path is absolute
--- @param path string
function module.isabs(path)
  -- Paths beginning with \\?\ are always absolute, but do not necessarily contain a drive.
  local ABS_PATTERN = [[\\?\]]
  if path:gsub("/", "\\"):sub(1, 4) == ABS_PATTERN then
    return true
  end

  _, path = module.splitdrive(path)
  return #path > 0 and contains(path:sub(1, 1), { "/", "\\" })
end

--- Return an absolute path.
--- @param path string
function module.abspath(path)
  if not module.isabs(path) then
    local cwd = getcwd()
    path = module.join(cwd, path)
  end
  return module.normpath(path)
end

--- Normalize case of pathname.
--- Makes all characters lowercase and all slashes into backslashes.
--- @param s string
function module.normcase(s)
  return s:gsub("/", "\\"):lower()
end

--- Return a relative version of a path
function module.relpath(path, start)
  if #path == 0 then
    return nil, "Given path is empty!"
  end

  if start == nil then
    start = "."
  end

  local start_abs = module.abspath(module.normpath(start))
  local path_abs = module.abspath(module.normpath(path))
  local start_drive, start_rest = module.splitdrive(start_abs)
  local path_drive, path_rest = module.splitdrive(path_abs)
  if module.normcase(start_drive) ~= module.normcase(path_drive) then
    return nil, ("path is on mount %r, start on mount %r"):format(path_drive, start_drive)
  end

  local start_list = {}
  for _, p in ipairs(util.split(start_rest, "[^\\]*")) do
    if #p > 0 then
      table.insert(start_list, p)
    end
  end

  local path_list = {}
  for _, p in ipairs(util.split(path_rest, "[^\\]*")) do
    if #p > 0 then
      table.insert(path_list, p)
    end
  end

  -- Work out how much of the filepath is shared by start and path.
  local i = 1
  for k = 1, math.min(#start_list, #path_list) do
    if module.normcase(start_list[k]) ~= module.normcase(path_list[k]) then
      break
    end
    i = k + 1
  end

  local rel_list = {}
  for j = 1, #start_list - i + 1 do
    rel_list[j] = ".."
  end
  local j = #rel_list + 1
  for k = i, #path_list do
    rel_list[j] = path_list[k]
    j = j + 1
  end

  if #rel_list == 0 then
    return "."
  end
  return module.join(table.unpack(rel_list))
end

return module
