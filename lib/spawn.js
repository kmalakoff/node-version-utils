var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var prepend = require('path-string-prepend');

var replaceNPMEnv = require('./replaceNPMEnv');
var PATH_KEY = require('./PATH_KEY');

function spawn(installPath, command, args, options, callback) {
  var env = replaceNPMEnv(process.env, installPath);
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot); // put the path to node and npm at the front
  if (PATH_KEY !== 'PATH') delete env.PATH; // PATH conflicts with nvs in Windows, prepending alone does not resolve the conflicts
  crossSpawn(command, args, assign({}, options, { cwd: process.cwd(), env: env, path: env[PATH_KEY] }), callback);
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
