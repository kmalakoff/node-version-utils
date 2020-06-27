var path = require('path');
var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');

var constants = require('./constants');
var replaceNPMEnv = require('./replaceNPMEnv');
var prependNodePath = require('./prependNodePath');

var isWindows = process.platform === 'win32';

function spawn(installPath, command, args, options, callback) {
  var execPath = path.join(installPath, constants.NODE);

  // replace npm config in environment
  var env = replaceNPMEnv(process.env, installPath);
  env.NODE = execPath; // set node variable for npm

  // put the path to node and npm at the front
  var prepend = prependNodePath(env[constants.PATH_KEY], env.npm_config_binroot);
  env[constants.PATH_KEY] = prepend.path;
  if (!options.silent) {
    prepend.removed.forEach(function (removed) {
      console.log('PATH -= ' + removed);
    });
    prepend.added.forEach(function (added) {
      console.log('PATH += ' + added);
    });
  }

  // 'which' in cross-spawn uses PATH in windows, but this causes issues in repeat spawn calls given PATH get propagated so PATH_KEY needs to select 'Path' over 'PATH' if both exist
  var deletePATH = isWindows && process.env.PATH !== undefined;
  if (isWindows) process.env.PATH = env[constants.PATH_KEY];
  crossSpawn(command, args, assign({}, options, { env: env }), function (err, result) {
    if (deletePATH) delete process.env.PATH;
    callback(err, result);
  });
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
