let col = require("./tracks_collection");

const PLAY_RATE = 42;

class Track {
    constructor (id, func) {
        this.track = this.findTrackById(id) || [];
        this.tact = 0;
        this.id = id;
        this.tickFunction = func;
        this.playerInterval = null;
    }

    findTrackById(id) {
        for (let item in col) {
            if(col[item].id === id) {
                return col[item].track;
            }
        }
    }

    play() {
        if (!this.playerInterval) {
            this.playerInterval = setInterval(()=>{this.tickTact(this.tickFunction)}, PLAY_RATE);
        }
    }

    pause() {
        if (this.playerInterval) {
            clearInterval(this.playerInterval);
            this.playerInterval = null;
        }
    }

    tickTact(callback) {
        if (callback && typeof callback === "function") {
            callback(this.track[this.tact], this.tact);
            this.tact = (this.tact + 1 ===  this.track.length ? 0 : this.tact + 1)
        }
    }

    get tactValue() {
        return this.track[this.tact];
    }
}

exports.Track = Track;