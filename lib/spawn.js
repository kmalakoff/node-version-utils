var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');

var constants = require('./constants');
var npmEnv = require('./npmEnv');
var removeFromEnvPath = require('./removeFromEnvPath');

function spawn(installPath, command, args, options, callback) {
  // replace npm config in environment
  var env = assign({}, process.env, npmEnv(installPath));

  // put the path to node and npm at the front
  env[constants.PATH_KEY] = env.npm_config_binroot + constants.DELIMITER + removeFromEnvPath(installPath);

  // 'which' in cross-spawn uses PATH in windows
  if (constants.PATH_KEY !== 'PATH') process.env.PATH = env[constants.PATH_KEY];
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
