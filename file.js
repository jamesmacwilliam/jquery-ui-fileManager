(function() {
  $.widget('ui.fileManager', {
    options: {
      defaultFolder: 'default'
    },

    _create: function() {
      var _this = this;
      this.element.on('drop', function(e) { return _this._drop(e);});
      this.element.on('dragover', function(e) { return _this._dragOver(e);});
      this.files = {};
      this.defaultFolder = this.options.defaultFolder;
      this.files[this.options.defaultFolder] = {files: {}, folders: {}};
      return this;
    },

    //load file
    _drop: function(e) {
      e.preventDefault();
      this.insertFiles(this.defaultFolder, e.originalEvent.dataTransfer.files);
      return this;
    },

    //drag over
    _dragOver: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    //get file by path - expects 'folder1.folder2.filename'
    _traverse: function(path) {
      _this = this;
      var endLocation;
      $.each(path.split('/'), function(pos, name) {
        endLocation = endLocation || _this.files;
        // traverse file tree - create directory if it does not exist
        if(typeof endLocation[name] === 'undefined') {
          endLocation[name] = {};
        }
        endLocation = endLocation[name];
        return endLocation;
      });
      return endLocation;
    },

    // read file as DataView
    readFile: function(path) {
      var file = this._traverse(path);
      var reader = new FileReader();
      var _this = this;
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        var buffer = reader.result;
        var view = new DataView(buffer);
        _this._execPromise('then', view);
      };
      return this._setupPromise();
    },

    // wrap deleteFile to accept multiple files
    deleteFiles: function(paths) {
      var _this = this;
      $.each(paths, function(pos, path) { return _this._deleteFile(path); });
      return this;
    },

    // wrap insert file to accept multiple files
    insertFiles: function(path, files) {
      var _this = this;
      $.each(files, function(pos, file) {
        return _this._insertFile(path, file);
      });
      return this;
    },

    // move file from start to end
    moveFile: function(start, end) {
      return this._insertFile(end, this._deleteFile(start));
    },

    // delete file at path
    _deleteFile: function(path) {
      var file = this.clone(this._traverse(path));
      delete this._traverse(path);
      return file;
    },

    // insert file at path
    _insertFile: function(path, file) {
      this._traverse(path)[file.name] = file;
      return file;
    },

    clone: function(obj) {
      return jQuery.extend(true, {}, obj);
    },

    //handle promises
    _setupPromise: function() {
      var _this = this;
      this.promises = {};
      this._promises = {then: function(cb) { return _this.promises.then = cb; }}
      return this._promises;
    },

    _execPromise: function (name, opts) {
      if (!(typeof this.promises.then === 'undefined')) {
        this.promises.then(opts);
        delete this.promises;
      }
      return this;
    },

    //cleanup
    destroy: function () {
      this.element.off('drop');
      this.element.off('dragover');
      return $.Widget.prototype.destroy.call(this);
    }
  })
}).call(this);
