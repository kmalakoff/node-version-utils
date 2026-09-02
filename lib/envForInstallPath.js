var path = require('path');
var constants = require('./constants');

var isWindows = process.platform === 'win32';

module.exports = function envForInstallPath(env, installPath) {
  // copy the non-npm environment
  var installEnv = {};
  for (var key in env) {
    if (key.toUpperCase().indexOf('NPM_') === 0) continue;
    installEnv[key] = env[key];
  }

  // override npm
  installEnv.npm_config_binroot = isWindows ? installPath : path.join(installPath, 'bin');
  installEnv.npm_config_root = isWindows ? installPath : path.join(installPath, 'lib');
  installEnv.npm_config_man = isWindows ? installPath : path.join(installPath, 'man');
  installEnv.npm_config_prefix = installPath;

  // override node
  installEnv.NODE_PATH = installEnv.npm_config_root;
  installEnv.NODE = path.join(installPath, constants.NODE); // set node variable for npm
  return installEnv;
};
