"use strict";
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var path = require('path');
var prepend = require('path-string-prepend');
var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var pathKey = require('env-path-key');
var startsCaseInsensitiveFn = require('./startsCaseInsensitiveFn');
var isWindows = process.platform === 'win32';
var startsNPM = startsCaseInsensitiveFn('npm_');
var startsPath = startsCaseInsensitiveFn('path');
module.exports = function spawnOptions(installPath, options) {
    var PATH_KEY = pathKey();
    var processEnv = process.env;
    var env = {};
    env.npm_config_binroot = isWindows ? installPath : path.join(installPath, 'bin');
    env.npm_config_root = isWindows ? installPath : path.join(installPath, 'lib');
    env.npm_config_man = isWindows ? installPath : path.join(installPath, 'man');
    env.npm_config_prefix = installPath;
    env.npm_node_execpath = path.join(env.npm_config_binroot, NODE);
    // copy the environment not for npm and skip case-insesitive additional paths
    for(var key in processEnv){
        // skip npm_ variants and non-matching path
        if (key.length > 4 && startsNPM(key)) continue;
        if (key.length === 4 && startsPath(key) && key !== PATH_KEY) continue;
        env[key] = processEnv[key];
    }
    // override node
    if (env.NODE !== undefined) env.NODE = env.npm_node_execpath;
    if (env.NODE_EXE !== undefined) env.NODE_EXE = env.npm_node_execpath;
    // put the path to node and npm at the front and remove nvs
    env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot);
    return _object_spread_props(_object_spread({}, options), {
        cwd: process.cwd(),
        env: env
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }