class Utils {
    static generateId(length) {
        let text = "";
        let possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}

exports.Utils = Utils;