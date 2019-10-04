"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NetworkLayer_1 = require("./NetworkLayer");
var PORT = 3000;
NetworkLayer_1.default.listen(PORT, function () {
    console.log("VK App server started on port  " + PORT);
});
