var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var prepend = require('path-string-prepend');

var envForInstallPath = require('./envForInstallPath');
var PATH_KEY = require('./constants').PATH_KEY;

function spawn(installPath, command, args, options, callback) {
  // put the path to node and npm at the front and remove nvs
  var env = envForInstallPath(process.env, installPath);
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot);
  crossSpawn(command, args, assign({}, options, { cwd: process.cwd(), env: env, execPath: env.npm_node_execpath, path: env[PATH_KEY] }), callback);
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
