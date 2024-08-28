local mod = {}

mod.split = function(text, separator)
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

-- robust method to split by lines, this handles both "\n" and "\r\n" sequences
mod.splitlines = function(text)
	local lines = {}
	local i = 1
	local search_pos = 0
	while true do
		local nl_pos = text:find("\n", search_pos + 1, true)
		if nl_pos == nil then
			-- if no newlines, then it is end of string
			lines[i] = text:sub(search_pos + 1, -1)
			return lines
		else
			if text:sub(nl_pos - 1, nl_pos - 1) == "\r" then
				-- there is carriage return just before the newline
				lines[i] = text:sub(search_pos + 1, nl_pos - 2)
			else
				-- there no carriage return just before the newline
				lines[i] = text:sub(search_pos + 1, nl_pos - 1)
			end
			i = i + 1
			search_pos = nl_pos
		end
	end
end

mod.strip = function(s)
	return (s:gsub("^%s*(.-)%s*$", "%1"))
end

return mod
