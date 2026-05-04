local module = {}

function module.bool(a, b)
  assert(a == b, ("Bools are different: %s ~= %s"):format(a, b))
end

function module.strings(a, b)
  assert(a == b, ("Strings are different: '%s' ~= '%s'"):format(a, b))
end

function module.lists(a, b)
  assert(#a == #b, ("Tables have different length: %s ~= %s"):format(#a, #b))
  for i = 1, #a do
    assert(a[i] == b[i], ("Tables have different content: %s ~= %s"):format(a[i], b[i]))
  end
end

function module.equal(a, b)
  assert(a == b, ("Objects are different: %s ~= %s"):format(a, b))
end

return module
