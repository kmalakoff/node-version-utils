var path = require('path');
var keys = require('lodash.keys');

var isWindows = process.platform === 'win32';

module.exports = function replaceNPMEnv(env, installPath) {
  var npmEnv = {
    npm_config_binroot: isWindows ? installPath : path.join(installPath, 'bin'),
    npm_config_root: isWindows ? installPath : path.join(installPath, 'lib'),
    npm_config_man: isWindows ? installPath : path.join(installPath, 'man'),
    npm_config_prefix: installPath,
  };
  if (isWindows) {
    var npmKeys = keys(npmEnv);
    for (var index = 0; index < npmKeys.length; index++) {
      var npmKey = npmKeys[index];
      npmEnv[npmKey.toUpperCase()] = npmEnv[npmKey];
    }
  }

  // copy the non-npm environment
  for (var key in env) {
    if (key.toUpperCase().indexOf('NPM_') !== 0) npmEnv[key] = env[key];
  }

  return npmEnv;
};
