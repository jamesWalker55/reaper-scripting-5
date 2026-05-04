-- port of os.path for Linux-based systems

local util = require("util")
local common = require("genericpath")

local getcwd = common.getcwd
local contains = util.contains

local module = {}

--- Split a pathname into drive and path. On Posix, drive is always empty.
--- @param path string
function module.splitdrive(path)
  return "", path
end

--[[
Join two or more pathname components, inserting '/' as needed.
If any component is an absolute path, all previous path components
will be discarded.  An empty last part will result in a path that
ends with a separator.
--]]
function module.join(a, ...)
  local p = { ... }
  local path = a
  for _, b in ipairs(p) do
    if b:sub(1, 1) == "/" then
      path = b
    elseif #path == 0 or path:sub(-1, -1) == "/" then
      path = path .. b
    else
      path = path .. "/" .. b
    end
  end
  return path
end

--- Split a path in root and extension.
--- The extension is everything starting at the last dot in the last
--- pathname component; the root is everything before that.
--- It is always true that root + ext == p.
function module.splitext(p)
  return common.splitext(p, "/", nil, ".")
end

-- Normalize a path, e.g. A//B, A/./B and A/foo/../B all become A/B.
-- It should be understood that this may change the meaning of the path
-- if it contains symbolic links!

--- Normalize path, eliminating double slashes, etc.
--- @param path string
function module.normpath(path)
  if #path == 0 then
    return "."
  end

  local initial_slashes = path:sub(1, 1) == "/"
  -- POSIX allows one or two initial slashes, but treats three or more as single slash.
  if initial_slashes and path:sub(2, 2) == "/" and not (path:sub(3, 3) == "/") then
    initial_slashes = 2
  end

  local comps = util.split(path, "[^/]*")
  local new_comps = {}
  for _, comp in ipairs(comps) do
    if contains(comp, { "", "." }) then
      goto continue
    end

    if
      comp ~= ".."
      or (not initial_slashes and #new_comps == 0)
      or (#new_comps > 0 and new_comps[#new_comps] == "..")
    then
      table.insert(new_comps, comp)
    elseif #new_comps > 0 then
      table.remove(new_comps)
    end
    ::continue::
  end
  comps = new_comps
  path = table.concat(comps, "/")
  if initial_slashes then
    if initial_slashes == true then
      initial_slashes = 1
    end

    path = ("/"):rep(initial_slashes) .. path
  end

  if #path > 0 then
    return path
  else
    return "."
  end
end

-- Split a path in head (everything up to the last '/') and tail (the
-- rest).  If the path ends in '/', tail will be empty.  If there is no
-- '/' in the path, head  will be empty.
-- Trailing '/'es are stripped from head unless it is the root.

--- Split a pathname.  Returns tuple "(head, tail)" where "tail" is
--- everything after the final slash.  Either part may be empty.
--- @param p string
function module.split(p)
  local sep_pos = ({ p:find(".*/") })[2] or 0
  local head, tail = p:sub(1, sep_pos), p:sub(sep_pos + 1)
  if #head > 0 and head ~= ("/"):rep(#head) then
    -- remove trailing slashes from head, unless it's all slashes
    -- https://stackoverflow.com/questions/17386792/how-to-implement-string-rfind-in-lua
    head = head:match("(.*[^/\\])") or head
  end
  return head, tail
end

-- Return whether a path is absolute.
-- Trivial in Posix, harder on the Mac or MS-DOS.

--- Test whether a path is absolute
function module.isabs(s)
  return s:sub(1, 1) == "/"
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

--- Normalize case of pathname.  Has no effect under Posix
--- @param s string
function module.normcase(s)
  return s
end

--- Return a relative version of a path
--- @param path string
--- @param start string|nil
function module.relpath(path, start)
  if #path == 0 then
    return nil, "Given path is empty!"
  end

  if start == nil then
    start = "."
  end

  start = module.abspath(start)
  path = module.abspath(path)

  local start_list = {}
  for _, p in ipairs(util.split(start, "[^/]*")) do
    if #p > 0 then
      table.insert(start_list, p)
    end
  end

  local path_list = {}
  for _, p in ipairs(util.split(path, "[^/]*")) do
    if #p > 0 then
      table.insert(path_list, p)
    end
  end

  -- Work out how much of the filepath is shared by start and path.
  local i = 1
  for k = 1, math.min(#start_list, #path_list) do
    if start_list[k] ~= path_list[k] then
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
