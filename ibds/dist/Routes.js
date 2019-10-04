"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Busboy = require("busboy");
var FileUploader_1 = require("./RequestHandlers/FileUploader");
var Routes = /** @class */ (function () {
    function Routes() {
    }
    Routes.prototype.routes = function (app) {
        // Allow Cross-Origin access to this server.
        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            next();
        });
        app.get('/test', function (req, res) {
            res.end("That's all folks, yeah!");
        });
        // Uploads a new file on the server.
        app.post('/upload', function (req, res) {
            var saveDir = path.resolve('./uploads/');
            var fu = new FileUploader_1.FileUploader(saveDir, 31457280, 10); // 30 MB and 1 file maximum
            // Lets create config for busboy
            var config = {
                headers: req.headers,
                limits: {
                    fileSize: fu.MaxFileSize,
                    files: fu.FilesCount
                }
            };
            var busboy = new Busboy(config);
            req.pipe(busboy);
            var uploadedFiles = [];
            busboy.on('file', function (fieldname, file, filename, encoding, mimeType) {
                fu.OnFile(fieldname, file, filename, encoding, mimeType);
                // Save name of uploaded file to array.
                file.on('end', function () {
                    uploadedFiles.push(filename);
                });
            });
            busboy.on('finish', function () {
                console.log('Upload complete');
                res.writeHead(200, { 'Connection': 'close' });
                var response = {
                    uploaded: uploadedFiles
                };
                res.end(JSON.stringify(response));
            });
        });
    };
    return Routes;
}());
exports.Routes = Routes;
