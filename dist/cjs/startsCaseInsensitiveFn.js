"use strict";
module.exports = function startsCaseInsensitiveFn(string) {
    var lower = string.toLowerCase();
    var upper = string.toUpperCase();
    return function startsCaseInsensitive(key) {
        if (key.length < string.length) return false;
        for(var i = 0; i < string.length; i++){
            if (key[i] !== lower[i] && key[i] !== upper[i]) return false;
        }
        return true;
    };
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }