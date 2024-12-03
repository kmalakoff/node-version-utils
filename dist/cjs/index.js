"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    spawn: function() {
        return _spawn.default;
    },
    spawnOptions: function() {
        return _spawnOptions.default;
    },
    spawnSync: function() {
        return _spawnSync.default;
    }
});
require("./polyfills.js");
var _spawn = /*#__PURE__*/ _interop_require_default(require("./spawn"));
var _spawnSync = /*#__PURE__*/ _interop_require_default(require("./spawnSync"));
var _spawnOptions = /*#__PURE__*/ _interop_require_default(require("./spawnOptions"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }