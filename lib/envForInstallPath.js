var path = require('path');

var isWindows = process.platform === 'win32';

module.exports = function envForInstallPath(env, installPath) {
  var installEnv = {
    npm_config_binroot: isWindows ? installPath : path.join(installPath, 'bin'),
    npm_config_root: isWindows ? installPath : path.join(installPath, 'lib'),
    npm_config_man: isWindows ? installPath : path.join(installPath, 'man'),
    npm_config_prefix: installPath,
  };
  installEnv.NODE_PATH = installEnv.npm_config_root;

  // copy the non-npm environment
  for (var key in env) {
    if (key.toUpperCase().indexOf('NPM_') === 0) continue;
    installEnv[key] = env[key];
  }

  return installEnv;
};
