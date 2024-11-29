"use strict";
var crossSpawn = require('cross-spawn-cb');
var spawnOptions = require('./spawnOptions');
module.exports = function spawnSync(installPath, command, args, options) {
    return crossSpawn.sync(command, args, spawnOptions(installPath, options));
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }