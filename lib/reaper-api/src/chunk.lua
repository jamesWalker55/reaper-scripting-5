local module = {}

--[[
  get/set state chunk for a track. argument `chunk` is optional
 ]]
module.track = function(track, chunk)
  if chunk == nil then
    local rv, xml = reaper.GetTrackStateChunk(track, "", false)
    if not rv then return nil, "Failed to get track state chunk" end
    return xml
  else
    local rv = reaper.SetTrackStateChunk(track, chunk, false)
    if not rv then return nil, "Failed to set track state chunk" end
    return true
  end
end

--[[
  get/set state chunk for a item. argument `chunk` is optional
 ]]
module.item = function(item, chunk)
  if chunk == nil then
    local rv, xml = reaper.GetItemStateChunk(item, "", false)
    if not rv then return nil, "Failed to get item state chunk" end
    return xml
  else
    local rv = reaper.SetItemStateChunk(item, chunk, false)
    if not rv then return nil, "Failed to set item state chunk" end
    return true
  end
end

--[[
  get/set state chunk for an envelope. argument `chunk` is optional
 ]]
module.envelope = function(envelope, chunk)
  if chunk == nil then
    local rv, xml = reaper.GetEnvelopeStateChunk(envelope, "", false)
    if not rv then return nil, "Failed to get envelope state chunk" end
    return xml
  else
    local rv = reaper.SetEnvelopeStateChunk(envelope, chunk, false)
    if not rv then return nil, "Failed to set envelope state chunk" end
    return true
  end
end

--[[
  escape a string to be used in a state chunk
 ]]
module.escape_string = function(name)
  if name == "" then
    return '""'
  elseif not name:find(" ") and not name:find("^[\"'`]") then
    -- single word with no quote at start, return as is
    return name
  else
    -- replace existing backquotes with single quotes then surround with backquotes
    name = name:gsub("`","'")
    name = "`" .. name .. "`"
    return name
  end
end

--[[
  find the next element with the given tag, return the character position in the chunk
  `tag` can be an array of tags to match
 ]]
module.findElement = function(chunk, tag, search_pos)
  if search_pos == nil then search_pos = 0 end

  if type(tag) == "table" then
    local found_pos = {}
    local i = 1
    for _, t in ipairs(tag) do
      local pos = chunk:find("<%s*" .. t .. "%s", search_pos)
      if pos then
        found_pos[i] = pos
        i = i + 1
      end
    end
    if i == 1 then
      return nil
    else
      return math.min(table.unpack(found_pos))
    end
  else
    local pattern = "<%s*" .. tag .. "%s"
    return ({chunk:find(pattern, search_pos)})[1]
  end
end

--[[
  this splits a text like:
  ```plain
  VST "VSTi: IL Harmor (Image-Line)" "IL Harmor.dll" 0 `d " s ' b '` 1229483375<56535449486D6F696C206861726D6F72> ""
  ```
  this assumes the first item doesn't start with a quote
 ]]
module.splitLine = function(line)
  local items = {}
  while true do
    local _, first_quote_pos = line:find(" [\"'`]")
    if first_quote_pos == nil then
      -- all remaining words are unquoted, add them
      for word in line:gmatch("%S+") do
        items[#items + 1] = word
      end
      return items
    else
      local first_quote = line:sub(first_quote_pos, first_quote_pos)
      -- add each unquoted word before the found quote
      for word in line:sub(0, first_quote_pos - 1):gmatch("%S+") do
        items[#items + 1] = word
      end
      -- find end quote position, then add entire string
      local end_quote_pos = line:find(first_quote, first_quote_pos + 1, true)
      if end_quote_pos == nil then return nil, "Error matching end quote: " .. first_quote end
      items[#items + 1] = line:sub(first_quote_pos, end_quote_pos)
      -- remove everything before end of string
      line = line:sub(end_quote_pos + 1, -1)
    end
  end
end

--[[
  remove quotes from a string if it exists, return as-is if no quotes found
 ]]
module.removeStringQuotes = function(text)
  if text:match("^[\"'`]") then
    return text:sub(2, -2)
  else
    return text
  end
end

return module
