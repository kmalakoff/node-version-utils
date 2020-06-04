var path = require('path');

var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var cleanEnvPaths = require('./cleanEnvPaths');
var constants = require('./constants');

var isWindows = process.platform === 'win32';

function spawn(installPath, command, args, options, callback) {
  var binPath = isWindows ? installPath : path.join(installPath, 'bin');
  var libPath = isWindows ? installPath : path.join(installPath, 'lib');
  var manPath = isWindows ? installPath : path.join(installPath, 'man');
  var envPaths = binPath + constants.DELIMITER + cleanEnvPaths(installPath);

  var env = assign({}, process.env);
  env.npm_config_prefix = installPath;
  env.npm_config_binroot = binPath;
  env.npm_config_root = libPath;
  env.npm_config_man = manPath;
  env[constants.PATH_KEY] = envPaths;

  process.env.PATH = envPaths; // 'which' in cross-spawn uses this in windows
  crossSpawn(command, args, assign({}, options, { cwd: process.cwd(), env: env }), callback);
}

module.exports = function spawnWrapper(installPath, command, args, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (typeof callback === 'function') return spawn(installPath, command, args, options || {}, callback);
  return new Promise(function (resolve, reject) {
    spawnWrapper(installPath, command, args, options, function spawnWrapperCallback(err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
