var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var prepend = require('path-string-prepend');

var envForInstallPath = require('./envForInstallPath');
var constants = require('./constants');
var PATH_KEY = constants.PATH_KEY;
var NVS_PATH = constants.SEP + 'nvs' + constants.SEP + 'node';

function filterNVS(path) {
  return path.indexOf(NVS_PATH) < 0;
}

var isWindows = process.platform === 'win32';

function spawn(installPath, command, args, options, callback) {
  var env = envForInstallPath(process.env, installPath);

  // put the path to node and npm at the front and remove nvs
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot, {filter: filterNVS});
  if (isWindows) env.path = env.PATH = env.Path = env[PATH_KEY];
  console.log(JSON.stringify(env, null, 2));
  crossSpawn(command, args, assign({}, options, { cwd: process.cwd(), env: env, execPath: env.NODE, path: env[PATH_KEY] }), callback);
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
