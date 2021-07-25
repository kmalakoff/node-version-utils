var fs = require('fs');
var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var prepend = require('path-string-prepend');

var envForInstallPath = require('./envForInstallPath');
var constants = require('./constants');
var PATH_KEY = constants.PATH_KEY;

function spawn(installPath, command, args, options, callback) {
  // put the path to node and npm at the front and remove nvs
  var env = envForInstallPath(process.env, installPath);
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot);

  // PATH conflicts with nvs in Windows, prepending alone does not resolve the conflicts
  if (PATH_KEY !== 'PATH' && env.PATH !== undefined) env.PATH = env[PATH_KEY];

  // TODO: remove
  // console.log('******BEFORE********');
  // try {
  //   console.log(fs.readdirSync(process.env[PATH_KEY].split(constants.DELIMITER)[0]));
  // } catch (err) {}
  // console.log(JSON.stringify(process.env, null, 2));
  console.log('******AFTER********');
  try {
    console.log(fs.readdirSync(env[PATH_KEY].split(constants.DELIMITER)[0]));
  } catch (err) {}
  console.log(env[PATH_KEY]);
  // console.log(JSON.stringify(env, null, 2));
  console.log('********************');
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
