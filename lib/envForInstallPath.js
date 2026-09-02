var path = require('path');
var constants = require('./constants');

var isWindows = process.platform === 'win32';

module.exports = function envForInstallPath(env, installPath) {
  var installEnv = {};
  installEnv.npm_config_binroot = isWindows ? installPath : path.join(installPath, 'bin');
  installEnv.npm_config_root = isWindows ? installPath : path.join(installPath, 'lib');
  installEnv.npm_config_man = isWindows ? installPath : path.join(installPath, 'man');
  installEnv.npm_config_prefix = installPath;
  installEnv.npm_node_execpath = path.join(installEnv.npm_config_binroot, constants.NODE);

  // copy the environment not for npm
  for (var key in env) {
    if (key.toLowerCase().indexOf('npm_') !== 0) installEnv[key] = env[key];
  }

  // override node
  if (installEnv.NODE !== undefined) installEnv.NODE = installEnv.npm_node_execpath;
  return installEnv;
};
