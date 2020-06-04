var path = require('path');

var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var cleanEnvPaths = require('./cleanEnvPaths');
var constants = require('./constants');

var isWindows = process.platform === 'win32';

function set(installPath, command, args, options, callback) {
  var binPath = isWindows ? installPath : path.join(installPath, 'bin');
  var libPath = isWindows ? installPath : path.join(installPath, 'lib');
  var manPath = isWindows ? installPath : path.join(installPath, 'man');
  var envPaths = binPath + constants.DELIMITER + cleanEnvPaths();
  var execPath = path.join(binPath, constants.NODE);

  var env = assign({}, process.env);
  env.npm_config_prefix = installPath;
  env.npm_config_binroot = binPath;
  env.npm_config_root = libPath;
  env.npm_config_man = manPath;
  env[constants.PATH_KEY] = envPaths;

  var spawnOptions = assign({}, options, { cwd: process.cwd(), env: env, path: envPaths, execPath: execPath });
  if (isWindows) {
    var PATH = process.env.PATH;
    process.env.PATH = envPaths; // 'which' in cross-set uses this in windows
    crossSpawn(command, args, spawnOptions, function (err, res) {
      process.env.PATH = PATH; // 'which' in cross-set uses this in windows
      callback(err, res);
    });
  }
  crossSpawn(command, args, spawnOptions, callback);
}

module.exports = function setWrapper(installPath, command, args, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (typeof callback === 'function') return set(installPath, command, args, options || {}, callback);
  return new Promise(function (resolve, reject) {
    setWrapper(installPath, command, args, options, function setWrapperCallback(err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
