const PLAY_RATE = 42;

class Track {
    constructor (track, func) {
        this.track = track;
        this.tact = 0;
        this.id = this.generateId(10);
        this.tickFunction = func;
        this.playerInterval = null;
    }

    generateId(length) {
        let text = "";
        let possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
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