var path = require('path');
var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');

var constants = require('./constants');
var npmEnv = require('./npmEnv');
var prependNodePath = require('./prependNodePath');

var isWindows = process.platform === 'win32';

function spawn(installPath, command, args, options, callback) {
  var execPath = path.join(installPath, constants.NODE);

  // replace npm config in environment
  var env = assign({}, process.env, npmEnv(installPath));
  env.NODE = execPath; // set node variable for npm

  // put the path to node and npm at the front
  var prepend = prependNodePath(env[constants.PATH_KEY], env.npm_config_binroot);
  env[constants.PATH_KEY] = prepend.path;
  prepend.removed.forEach(function (removed) {
    console.log('PATH -= ' + removed);
  });
  prepend.added.forEach(function (added) {
    console.log('PATH += ' + added);
  });

  // 'which' in cross-spawn uses PATH in windows
  if (isWindows) process.env.PATH = env[constants.PATH_KEY];
  crossSpawn(command, args, assign({}, options, { cwd: process.cwd(), env: env, execPath: execPath }), callback);
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
