-- override current directory function for testing
local genericpath = require("genericpath")
local cwd_path = [[/home/user/bar]]
local cwd_dir = [[bar]]
genericpath.getcwd = function()
	return cwd_path
end

local path = require("posixpath")
local test = require("test")

function test_join()
	test.strings(path.join("/foo", "bar", "/bar", "baz"), "/bar/baz")
	test.strings(path.join("/foo", "bar", "baz"), "/foo/bar/baz")
	test.strings(path.join("/foo/", "bar/", "baz/"), "/foo/bar/baz/")
end

function splitextTest(p, filename, ext)
	test.lists({ path.splitext(p) }, { filename, ext })
	test.lists({ path.splitext("/" .. p) }, { "/" .. filename, ext })
	test.lists({ path.splitext("abc/" .. p) }, { "abc/" .. filename, ext })
	test.lists({ path.splitext("abc.def/" .. p) }, { "abc.def/" .. filename, ext })
	test.lists({ path.splitext("/abc.def/" .. p) }, { "/abc.def/" .. filename, ext })
	test.lists({ path.splitext(p .. "/") }, { filename .. ext .. "/", "" })
end

function test_splitext()
	splitextTest("foo.bar", "foo", ".bar")
	splitextTest("foo.boo.bar", "foo.boo", ".bar")
	splitextTest("foo.boo.biff.bar", "foo.boo.biff", ".bar")
	splitextTest(".csh.rc", ".csh", ".rc")
	splitextTest("nodots", "nodots", "")
	splitextTest(".cshrc", ".cshrc", "")
	splitextTest("...manydots", "...manydots", "")
	splitextTest("...manydots.ext", "...manydots", ".ext")
	splitextTest(".", ".", "")
	splitextTest("..", "..", "")
	splitextTest("........", "........", "")
	splitextTest("", "", "")
end

function test_normpath()
	test.strings(path.normpath(""), ".")
	test.strings(path.normpath("/"), "/")
	test.strings(path.normpath("//"), "//")
	test.strings(path.normpath("///"), "/")
	test.strings(path.normpath("///foo/.//bar//"), "/foo/bar")
	test.strings(path.normpath("///foo/.//bar//.//..//.//baz"), "/foo/baz")
	test.strings(path.normpath("///..//./foo/.//bar"), "/foo/bar")
end

function test_split()
	test.lists({ path.split("/foo/bar") }, { "/foo", "bar" })
	test.lists({ path.split("/") }, { "/", "" })
	test.lists({ path.split("foo") }, { "", "foo" })
	test.lists({ path.split("////foo") }, { "////", "foo" })
	test.lists({ path.split("//foo//bar") }, { "//foo", "bar" })
end

function test_isabs()
	test.bool(path.isabs(""), false)
	test.bool(path.isabs("/"), true)
	test.bool(path.isabs("/foo"), true)
	test.bool(path.isabs("/foo/bar"), true)
	test.bool(path.isabs("foo/bar"), false)
end

function test_relpath()
	test.equal(path.relpath(""), nil)
	test.strings(path.relpath("a"), "a")
	test.strings(path.relpath(path.abspath("a")), "a")
	test.strings(path.relpath("a/b"), "a/b")
	test.strings(path.relpath("../a/b"), "../a/b")
	test.strings(path.relpath("a", "../b"), "../" .. cwd_dir .. "/a")
	test.strings(path.relpath("a/b", "../c"), "../" .. cwd_dir .. "/a/b")
	test.strings(path.relpath("a", "b/c"), "../../a")
	test.strings(path.relpath("a", "a"), ".")
	test.strings(path.relpath("/foo/bar/bat", "/x/y/z"), "../../../foo/bar/bat")
	test.strings(path.relpath("/foo/bar/bat", "/foo/bar"), "bat")
	test.strings(path.relpath("/foo/bar/bat", "/"), "foo/bar/bat")
	test.strings(path.relpath("/", "/foo/bar/bat"), "../../..")
	test.strings(path.relpath("/foo/bar/bat", "/x"), "../foo/bar/bat")
	test.strings(path.relpath("/x", "/foo/bar/bat"), "../../../x")
	test.strings(path.relpath("/", "/"), ".")
	test.strings(path.relpath("/a", "/a"), ".")
	test.strings(path.relpath("/a/b", "/a/b"), ".")
end

test_join()
test_splitext()
test_normpath()
test_split()
test_isabs()
test_relpath()
