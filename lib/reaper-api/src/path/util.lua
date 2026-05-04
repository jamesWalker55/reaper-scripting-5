local module = {}

function module.contains(val, arr)
  for _, x in ipairs(arr) do
    if val == x then
      return true
    end
  end
  return false
end

-- http://lua-users.org/wiki/SplitJoin

-- local str = "a,,b"     -- comma-separated list
-- local pat = "[^,]*"    -- everything except commas
-- assert (table.concat(split(str, pat), ",") == str)

-- splits 'str' into pieces matching 'pat', returns them as an array
-- the following minimalistic splitting function now is a true inverse of table.concat
function module.split(str, pat)
  local tbl = {}
  str:gsub(pat, function(x)
    tbl[#tbl + 1] = x
  end)
  return tbl
end

return module
