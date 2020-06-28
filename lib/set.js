var path = require('path');
var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');

var replaceNPMEnv = require('./replaceNPMEnv');
var prependNodePath = require('./prependNodePath');

var constants = require('./constants');
var PATH_KEY = constants.PATH_KEY;
var NODE = constants.NODE;

function spawn(installPath, command, args, options, callback) {
  var env = replaceNPMEnv(process.env, installPath);

  // put the path to node and npm at the front
  var prepend = prependNodePath(env[PATH_KEY], env.npm_config_binroot);
  env[PATH_KEY] = prepend.path;
  if (!options.silent) {
    prepend.removed.forEach(function (removed) {
      console.log('PATH -= ' + removed);
    });
    prepend.added.forEach(function (added) {
      console.log('PATH += ' + added);
    });
  }

  if (PATH_KEY !== 'PATH') delete env.PATH; // clean PATH
  crossSpawn(command, args, assign({}, options, { cwd: process.cwd(), env: env, path: env[PATH_KEY], execPath: path.join(installPath, NODE) }), callback);
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
