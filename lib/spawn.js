var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');

var replaceNPMEnv = require('./replaceNPMEnv');
var prependNodePath = require('./prependNodePath');

var constants = require('./constants');
var PATH_KEY = constants.PATH_KEY;

function spawn(installPath, command, args, options, callback) {
  var env = replaceNPMEnv(process.env, installPath);
  env[PATH_KEY] = prependNodePath(env[PATH_KEY], env.npm_config_binroot).path; // put the path to node and npm at the front
  crossSpawn(command, args, assign({}, options, { env: env, path: env[PATH_KEY] }), callback);
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
