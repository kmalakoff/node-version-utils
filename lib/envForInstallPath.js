var path = require('path');
var constants = require('./constants');

var isWindows = process.platform === 'win32';

module.exports = function envForInstallPath(env, installPath) {
  var installEnv = {
    npm_config_binroot: isWindows ? installPath : path.join(installPath, 'bin'),
    npm_config_root: isWindows ? installPath : path.join(installPath, 'lib'),
    npm_config_man: isWindows ? installPath : path.join(installPath, 'man'),
    npm_config_prefix: installPath,
  };
  installEnv.NODE_PATH = installEnv.npm_config_root;
  installEnv.NODE = path.join(installPath, constants.NODE); // set node variable for npm

  // copy the non-npm environment
  for (var key in env) {
    if (key.toUpperCase().indexOf('NPM_') === 0) continue;
    installEnv[key] = env[key];
  }

  return installEnv;
};
