var assign = require('object-assign');
var crossSpawn = require('cross-spawn-cb');
var prepend = require('path-string-prepend');

var replaceNPMEnv = require('./replaceNPMEnv');
var pathKey = require('./pathKey');

function spawn(installPath, command, args, options, callback) {
  var PATH_KEY = pathKey(process.env);
  var env = replaceNPMEnv(process.env, installPath);
  env[PATH_KEY] = prepend(env[PATH_KEY], env.npm_config_binroot); // put the path to node and npm at the front
  // if (PATH_KEY !== 'PATH' && env.PATH !== undefined) env.PATH = prepend(env.PATH, env.npm_config_binroot).path; // put the path to node and npm at the front
  // if (PATH_KEY !== 'PATH' && env.PATH !== undefined) delete env.PATH; // PATH conflicts with nvs in Windows, prepending alone does not resolve the conflicts
  console.log('PATH_KEY, env[PATH_KEY]', PATH_KEY, '\n', env[PATH_KEY], '\n', env.PATH);
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
