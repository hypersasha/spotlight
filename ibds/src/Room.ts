// @ts-ignore
import Track from "../../lib/Track";

export class Room {

    public users: Array<String>;

    constructor (public id : string, public track : Track, public title : string, public description : string) {
        this.id = id;
        this.track = track;
        this.users = [];
        this.title = title || "Без названия";
        this.description = description || "";
    }
}