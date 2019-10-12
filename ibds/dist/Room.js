"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Room = /** @class */ (function () {
    function Room(id, track, title, description) {
        this.id = id;
        this.track = track;
        this.title = title;
        this.description = description;
        this.id = id;
        this.track = track;
        this.users = [];
        this.title = title || "Без названия";
        this.description = description || "";
    }
    return Room;
}());
exports.Room = Room;
