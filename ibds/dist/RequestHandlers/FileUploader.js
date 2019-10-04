"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var FileUploader = /** @class */ (function () {
    /**
     * Constructor
     * @param saveTo Directory to save file.
     * @param max_file_size_bytes Max file size in bytes.
     * @param files_count Max files count to upload.
     */
    function FileUploader(saveTo, max_file_size_bytes, files_count) {
        this.maxFileSize = max_file_size_bytes || 5242880; // 5MB by default
        this.filesCount = files_count || 1;
        this.saveTo = saveTo || path.resolve('./uploads/');
        console.log('Initializing FileUploader with path: ');
        console.log(saveTo);
    }
    Object.defineProperty(FileUploader.prototype, "MaxFileSize", {
        get: function () {
            return this.maxFileSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileUploader.prototype, "FilesCount", {
        get: function () {
            return this.filesCount;
        },
        enumerable: true,
        configurable: true
    });
    FileUploader.prototype.OnFile = function (fieldname, file, filename, encoding, mimeType) {
        console.log('Saving file to: ' + path.join(this.saveTo, filename));
        file.pipe(fs.createWriteStream(path.join(this.saveTo, filename)));
    };
    return FileUploader;
}());
exports.FileUploader = FileUploader;
