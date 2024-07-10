-- this module handles reaper configurations and settings in *.ini files

local file = {}

-- checks if the given path is a valid file/directory
local function fileOrDirExists(path)
  path = reaper.resolve_fn2(path, "", "")
  if reaper.file_exists(path) then return true end

  -- remove trailing slashes at end of path
  while path:match([[\$]]) or path:match([[/$]]) do
    path = path:sub(1, -2)
  end

  local file, message, code = io.open(path)
  if file then
    io.close(file)
    return true
  elseif code == 13 then
    return true
  else
    return false
  end
end

-- checks if the given path is a valid file/directory
file.exists = function(path, files_only)
  if files_only then
    path = reaper.resolve_fn2(path, "", "")
    return reaper.file_exists(path)
  else
    return fileOrDirExists(path)
  end
end

file.lines = function(path)
  -- check path exists
  if not file.exists(path, true) then return nil end

  local lines = {}
  local i = 1
  for l in io.lines(path) do
    lines[i] = l
    i = i + 1
  end
  return lines
end

--[[
  return a path relative to the current Reaper data folder. Example:
  ```
  file.abs_path("reaper-fxfolders.ini")
  -- C:\Users\Bob\AppData\Roaming\REAPER\reaper-fxfolders.ini
  ```
 ]]
file.absPath = function(rel_path)
  if rel_path == nil then rel_path = "" end

  local reaper_ini_path = reaper.get_ini_file()
  -- assume base dir is parent directory of ini_path
  local reaper_base_dir = reaper_ini_path:match([[^(.+[\/])]])
  return reaper_base_dir .. rel_path
end

local function stringstrip(s)
  return (s:gsub("^%s*(.-)%s*$", "%1"))
end

local module = {}

--[[
  find first occurence of ";" in the given string then remove text after it
 ]]
local function removeComment(line)
  local comment_pos = line:find(";", nil, true)
  if comment_pos == nil then
    return line
  else
    return line:sub(1, comment_pos - 1)
  end
end

--[[
  parse a string like `[this is a section]` to the section name,
  returns null for invalid inputs
 ]]
local function parseSection(line)
  local section_name = line:match("%[(.+)%]")
  return section_name
end

--[[
  parse a string like `This_Key=this value` to a key-value pair,
  returns null for invalid inputs
 ]]
local function parseAssignment(line)
  local assign_pos = line:find("=")
  if assign_pos == nil then return end

  local key = stringstrip(line:sub(1, assign_pos - 1))
  local val = stringstrip(line:sub(assign_pos + 1, -1))
  return key, val
end

--[[
  parse a given ini file to a table,
  returns `{null, (error message)}` if the input file is invalid
 ]]
module.parseIni = function(ini_path, allow_comments)
  if allow_comments == nil then allow_comments = false end

  local ini_lines = file.lines(ini_path)
  if ini_lines == nil then return nil, "Given path does not exist: " .. ini_path end

  local ini_table = {}
  local current_section = nil
  for _, line in ipairs(ini_lines) do
    -- pre-process line
    if allow_comments then line = removeComment(line) end
    line = stringstrip(line)

    local bracket_pos = line:find("[", nil, true)
    if bracket_pos == 1 then
      -- line is a section definition
      local section = parseSection(line)
      if section == nil then return nil, "Invalid section definition: " .. line end

      ini_table[section] = {}
      current_section = section
    elseif line ~= "" then
      -- line is an assignment
      local key, val = parseAssignment(line)
      if key == nil then return nil, "Invalid assignment: " .. line end
      if current_section == nil then return nil, "Assignment occured before section definition: " .. line end

      ini_table[current_section][key] = val
    end
  end
  return ini_table
end

return module