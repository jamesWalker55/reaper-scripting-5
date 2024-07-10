-- this module helps you handle track state chunks like arrays

local function string_split(text, separator)
  local items = {}
  local i = 1
  local search_pos = 0
  while true do
    local match_pos = text:find(separator, search_pos + 1, true)
    if match_pos == nil then
      -- if no match, then it is end of string
      items[i] = text:sub(search_pos + 1, -1)
      return items
    else
      -- split the text at that point
      items[i] = text:sub(search_pos + 1, match_pos - 1)
      i = i + 1
      search_pos = match_pos
    end
  end
end

local module = {}

local function parseChunkLines(lines, start_pos)
  local i = start_pos == nil and 1 or start_pos

  local array = {}
  local array_len = 1
  while true do
    local line = lines[i]
    assert(line ~= nil, "Unexpected EOF")
    if i == start_pos then
      -- first line MUST be start of block
      array[array_len] = assert(line:match("^<(.+)"), "Parsing error")
    elseif line == ">" then
      -- reached end of block
      return array, i - start_pos
    elseif line:match("^<") then
      -- reached new block
      local subblock, lines_processed = parseChunkLines(lines, i)
      i = i + lines_processed
      array[array_len] = subblock
    else
      array[array_len] = line
    end
    i = i + 1
    array_len = array_len + 1
  end
end

module.fromChunk = function(chunk)
  local lines = string_split(chunk, "\n")  -- use split instead of splitline for more efficiency
  local array = parseChunkLines(lines, 1)
  return array
end

local function arrayToChunk(arr)
  for i, val in ipairs(arr) do
    if type(val) == "table" then
      arr[i] = arrayToChunk(val)
    end
  end
  return "<" .. table.concat(arr, "\n") .. "\n>"
end

module.toChunk = function(array)
  return arrayToChunk(array) .. "\n"
end

-- tests the toArray and fromArray functions
module._testChunk = function(chunk)
  local chunk_copy = module.toChunk(module.fromChunk(chunk))
  return chunk == chunk_copy
end

-- get the first line of each element, for pretty printing
module._tagLines = function(array)
  local lines = {}
  local lines_count = 1
  lines[lines_count] = array[1]
  for _, subtable in ipairs(array) do
    if type(subtable) == "table" then
      local subelements = module._tagLines(subtable)
      lines_count = lines_count + 1
      lines[lines_count] = subelements
    end
  end
  return lines
end

return module
