// @ts-ignore
import Track from "../../lib/Track";

export class Room {

    public users: Array<String>;

    constructor (public id : string, public track : Track) {
        this.id = id;
        this.track = track;
        this.users = [];
    }
}