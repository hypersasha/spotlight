"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Routes_1 = require("./Routes");
var path = require("path");
var NetworkLayer = /** @class */ (function () {
    function NetworkLayer() {
        this.routesMap = new Routes_1.Routes();
        this.app = express();
        this.app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));
        this.config();
        this.routesMap.routes(this.app);
    }
    NetworkLayer.prototype.config = function () {
        //example of function
    };
    return NetworkLayer;
}());
exports.default = new NetworkLayer().app;
