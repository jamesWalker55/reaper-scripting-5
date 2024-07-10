-- this module handles reaper configurations and settings in *.ini files

require "lib.str-funcs"
local file = require "lib.file"

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

  local key = line:sub(1, assign_pos - 1):strip()
  local val = line:sub(assign_pos + 1, -1):strip()
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
    line = line:strip()

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