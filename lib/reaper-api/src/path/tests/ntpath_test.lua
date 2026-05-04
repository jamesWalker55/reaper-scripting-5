-- override current directory function for testing
local genericpath = require("genericpath")
local cwd_path = [[D:\Programming\path]]
local cwd_dir = [[path]]
genericpath.getcwd = function()
  return cwd_path
end

local path = require("ntpath")
local test = require("test")

function test_splitext()
  test.lists({ path.splitext("foo.ext") }, { "foo", ".ext" })
  test.lists({ path.splitext("/foo/foo.ext") }, { "/foo/foo", ".ext" })
  test.lists({ path.splitext(".ext") }, { ".ext", "" })
  test.lists({ path.splitext("\\foo.ext\\foo") }, { "\\foo.ext\\foo", "" })
  test.lists({ path.splitext("foo.ext\\") }, { "foo.ext\\", "" })
  test.lists({ path.splitext("") }, { "", "" })
  test.lists({ path.splitext("foo.bar.ext") }, { "foo.bar", ".ext" })
  test.lists({ path.splitext("xx/foo.bar.ext") }, { "xx/foo.bar", ".ext" })
  test.lists({ path.splitext("xx\\foo.bar.ext") }, { "xx\\foo.bar", ".ext" })
  test.lists({ path.splitext("c:a/b\\c.d") }, { "c:a/b\\c", ".d" })
end

function test_splitdrive()
  test.lists({ path.splitdrive("c:\\foo\\bar") }, { "c:", "\\foo\\bar" })
  test.lists({ path.splitdrive("c:/foo/bar") }, { "c:", "/foo/bar" })
  test.lists({ path.splitdrive("\\\\conky\\mountpoint\\foo\\bar") }, { "\\\\conky\\mountpoint", "\\foo\\bar" })
  test.lists({ path.splitdrive("//conky/mountpoint/foo/bar") }, { "//conky/mountpoint", "/foo/bar" })
  test.lists({ path.splitdrive("\\\\\\conky\\mountpoint\\foo\\bar") }, { "", "\\\\\\conky\\mountpoint\\foo\\bar" })
  test.lists({ path.splitdrive("///conky/mountpoint/foo/bar") }, { "", "///conky/mountpoint/foo/bar" })
  test.lists({ path.splitdrive("\\\\conky\\\\mountpoint\\foo\\bar") }, { "", "\\\\conky\\\\mountpoint\\foo\\bar" })
  test.lists({ path.splitdrive("//conky//mountpoint/foo/bar") }, { "", "//conky//mountpoint/foo/bar" })
  -- Issue #19911: UNC part containing U+0130
  test.lists({ path.splitdrive("//conky/MOUNTPOİNT/foo/bar") }, { "//conky/MOUNTPOİNT", "/foo/bar" })
end

function test_join()
  test.strings(path.join(""), "")
  test.strings(path.join("", "", ""), "")
  test.strings(path.join("a"), "a")
  test.strings(path.join("/a"), "/a")
  test.strings(path.join("\\a"), "\\a")
  test.strings(path.join("a:"), "a:")
  test.strings(path.join("a:", "\\b"), "a:\\b")
  test.strings(path.join("a", "\\b"), "\\b")
  test.strings(path.join("a", "b", "c"), "a\\b\\c")
  test.strings(path.join("a\\", "b", "c"), "a\\b\\c")
  test.strings(path.join("a", "b\\", "c"), "a\\b\\c")
  test.strings(path.join("a", "b", "\\c"), "\\c")
  test.strings(path.join("d:\\", "\\pleep"), "d:\\pleep")
  test.strings(path.join("d:\\", "a", "b"), "d:\\a\\b")

  test.strings(path.join("", "a"), "a")
  test.strings(path.join("", "", "", "", "a"), "a")
  test.strings(path.join("a", ""), "a\\")
  test.strings(path.join("a", "", "", "", ""), "a\\")
  test.strings(path.join("a\\", ""), "a\\")
  test.strings(path.join("a\\", "", "", "", ""), "a\\")
  test.strings(path.join("a/", ""), "a/")

  test.strings(path.join("a/b", "x/y"), "a/b\\x/y")
  test.strings(path.join("/a/b", "x/y"), "/a/b\\x/y")
  test.strings(path.join("/a/b/", "x/y"), "/a/b/x/y")
  test.strings(path.join("c:", "x/y"), "c:x/y")
  test.strings(path.join("c:a/b", "x/y"), "c:a/b\\x/y")
  test.strings(path.join("c:a/b/", "x/y"), "c:a/b/x/y")
  test.strings(path.join("c:/", "x/y"), "c:/x/y")
  test.strings(path.join("c:/a/b", "x/y"), "c:/a/b\\x/y")
  test.strings(path.join("c:/a/b/", "x/y"), "c:/a/b/x/y")
  test.strings(path.join("//computer/share", "x/y"), "//computer/share\\x/y")
  test.strings(path.join("//computer/share/", "x/y"), "//computer/share/x/y")
  test.strings(path.join("//computer/share/a/b", "x/y"), "//computer/share/a/b\\x/y")

  test.strings(path.join("a/b", "/x/y"), "/x/y")
  test.strings(path.join("/a/b", "/x/y"), "/x/y")
  test.strings(path.join("c:", "/x/y"), "c:/x/y")
  test.strings(path.join("c:a/b", "/x/y"), "c:/x/y")
  test.strings(path.join("c:/", "/x/y"), "c:/x/y")
  test.strings(path.join("c:/a/b", "/x/y"), "c:/x/y")
  test.strings(path.join("//computer/share", "/x/y"), "//computer/share/x/y")
  test.strings(path.join("//computer/share/", "/x/y"), "//computer/share/x/y")
  test.strings(path.join("//computer/share/a", "/x/y"), "//computer/share/x/y")

  test.strings(path.join("c:", "C:x/y"), "C:x/y")
  test.strings(path.join("c:a/b", "C:x/y"), "C:a/b\\x/y")
  test.strings(path.join("c:/", "C:x/y"), "C:/x/y")
  test.strings(path.join("c:/a/b", "C:x/y"), "C:/a/b\\x/y")

  for _, x in ipairs({
    "",
    "a/b",
    "/a/b",
    "c:",
    "c:a/b",
    "c:/",
    "c:/a/b",
    "//computer/share",
    "//computer/share/",
    "//computer/share/a/b",
  }) do
    for _, y in ipairs({ "d:", "d:x/y", "d:/", "d:/x/y", "//machine/common", "//machine/common/", "//machine/common/x/y" }) do
      test.strings(path.join(x, y), y)
    end
  end

  test.strings(path.join("\\\\computer\\share\\", "a", "b"), "\\\\computer\\share\\a\\b")
  test.strings(path.join("\\\\computer\\share", "a", "b"), "\\\\computer\\share\\a\\b")
  test.strings(path.join("\\\\computer\\share", "a\\b"), "\\\\computer\\share\\a\\b")
  test.strings(path.join("//computer/share/", "a", "b"), "//computer/share/a\\b")
  test.strings(path.join("//computer/share", "a", "b"), "//computer/share\\a\\b")
  test.strings(path.join("//computer/share", "a/b"), "//computer/share\\a/b")
end

function test_normpath()
  test.strings(path.normpath("A//////././//.//B"), "A\\B")
  test.strings(path.normpath("A/./B"), "A\\B")
  test.strings(path.normpath("A/foo/../B"), "A\\B")
  test.strings(path.normpath("C:A//B"), "C:A\\B")
  test.strings(path.normpath("D:A/./B"), "D:A\\B")
  test.strings(path.normpath("e:A/foo/../B"), "e:A\\B")

  test.strings(path.normpath("C:///A//B"), "C:\\A\\B")
  test.strings(path.normpath("D:///A/./B"), "D:\\A\\B")
  test.strings(path.normpath("e:///A/foo/../B"), "e:\\A\\B")

  test.strings(path.normpath(".."), "..")
  test.strings(path.normpath("."), ".")
  test.strings(path.normpath(""), ".")
  test.strings(path.normpath("/"), "\\")
  test.strings(path.normpath("c:/"), "c:\\")
  test.strings(path.normpath("/../.././.."), "\\")
  test.strings(path.normpath("c:/../../.."), "c:\\")
  test.strings(path.normpath("../.././.."), "..\\..\\..")
  test.strings(path.normpath("K:../.././.."), "K:..\\..\\..")
  test.strings(path.normpath("C:////a/b"), "C:\\a\\b")
  test.strings(path.normpath("//machine/share//a/b"), "\\\\machine\\share\\a\\b")

  test.strings(path.normpath("\\\\.\\NUL"), "\\\\.\\NUL")
  test.strings(path.normpath("\\\\?\\D:/XY\\Z"), "\\\\?\\D:/XY\\Z")
end

function test_isabs()
  test.bool(path.isabs("c:\\"), true)
  test.bool(path.isabs("\\\\conky\\mountpoint\\"), true)
  test.bool(path.isabs("\\foo"), true)
  test.bool(path.isabs("\\foo\\bar"), true)
end

function test_abspath()
  test.strings(path.abspath("C:\\"), "C:\\")
  -- with support.temp_cwd(support.TESTFN) as cwd_path: -- bpo-31047
  test.strings(path.abspath(""), cwd_path)
  test.strings(path.abspath(" "), cwd_path .. "\\ ")
  test.strings(path.abspath("?"), cwd_path .. "\\?")
  -- -- disable this test, this depends on a python-only function
  -- local drive, _ = path.splitdrive(cwd_path)
  -- test.strings(path.abspath("/abc/"), drive .. "\\abc")
end

function test_relpath()
  test.strings(path.relpath("a"), "a")
  test.strings(path.relpath(path.abspath("a")), "a")
  test.strings(path.relpath("a/b"), "a\\b")
  test.strings(path.relpath("../a/b"), "..\\a\\b")
  test.strings(path.relpath("a", "../b"), "..\\" .. cwd_dir .. "\\a")
  test.strings(path.relpath("a/b", "../c"), "..\\" .. cwd_dir .. "\\a\\b")
  test.strings(path.relpath("a", "b/c"), "..\\..\\a")
  test.strings(path.relpath("c:/foo/bar/bat", "c:/x/y"), "..\\..\\foo\\bar\\bat")
  test.strings(path.relpath("//conky/mountpoint/a", "//conky/mountpoint/b/c"), "..\\..\\a")
  test.strings(path.relpath("a", "a"), ".")
  test.strings(path.relpath("/foo/bar/bat", "/x/y/z"), "..\\..\\..\\foo\\bar\\bat")
  test.strings(path.relpath("/foo/bar/bat", "/foo/bar"), "bat")
  test.strings(path.relpath("/foo/bar/bat", "/"), "foo\\bar\\bat")
  test.strings(path.relpath("/", "/foo/bar/bat"), "..\\..\\..")
  test.strings(path.relpath("/foo/bar/bat", "/x"), "..\\foo\\bar\\bat")
  test.strings(path.relpath("/x", "/foo/bar/bat"), "..\\..\\..\\x")
  test.strings(path.relpath("/", "/"), ".")
  test.strings(path.relpath("/a", "/a"), ".")
  test.strings(path.relpath("/a/b", "/a/b"), ".")
  test.strings(path.relpath("c:/foo", "C:/FOO"), ".")
end

function test_split()
  test.lists({ path.split("c:\\foo\\bar") }, { "c:\\foo", "bar" })
  test.lists({ path.split("\\\\conky\\mountpoint\\foo\\bar") }, { "\\\\conky\\mountpoint\\foo", "bar" })
  test.lists({ path.split("c:\\") }, { "c:\\", "" })
  test.lists({ path.split("\\\\conky\\mountpoint\\") }, { "\\\\conky\\mountpoint\\", "" })
  test.lists({ path.split("c:/") }, { "c:/", "" })
  test.lists({ path.split("//conky/mountpoint/") }, { "//conky/mountpoint/", "" })
end

test_splitext()
test_splitdrive()
test_join()
test_normpath()
test_isabs()
test_abspath()
test_relpath()
test_split()
