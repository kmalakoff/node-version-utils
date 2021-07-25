var path = require('path');
var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var prepend = require('path-string-prepend');

var replaceNPMEnv = require('./replaceNPMEnv');
var constants = require('./constants');
var PATH_KEY = constants.PATH_KEY;

function spawn(installPath, command, args, options, callback) {
  var env = replaceNPMEnv(process.env, installPath);
  var execPath = path.join(installPath, constants.NODE);
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot); // put the path to node and npm at the front
  if (PATH_KEY !== 'PATH' && env.PATH !== undefined) env.PATH = prepend(env.PATH, env.npm_config_binroot); // put the path to node and npm at the front
  crossSpawn(command, args, assign({}, options, { cwd: process.cwd(), env: env, path: env[PATH_KEY], execPath: execPath }), callback);
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
