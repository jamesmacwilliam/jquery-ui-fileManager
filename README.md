# Design and FileManager API

Usage:
===========================
* Open index.html
* setup FileManager widget -
```
$(document).fileManager({defaultFolder: 'foo'});
```
* drag file over page and drop
* manipulate file within the folder
```
target.fileManager('readFile', 'foo/filename').then(function(file) { return window.x = file;});
```

Methods
===========================
- readFile (uses promise behavior 'then' to access file as DataView)
- deleteFiles (specifiy array of paths)
- insertFiles (specify a path and then an array of files)
- moveFile (specify 2 paths)
