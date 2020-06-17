var path = require('path');

var isWindows = process.platform === 'win32';

module.exports = function npmEnv(installPath) {
  return {
    npm_config_binroot: isWindows ? installPath : path.join(installPath, 'bin'),
    NPM_CONFIG_BINROOT: isWindows ? installPath : path.join(installPath, 'bin'),
    npm_config_root: isWindows ? installPath : path.join(installPath, 'lib'),
    NPM_CONFIG_ROOT: isWindows ? installPath : path.join(installPath, 'lib'),
    npm_config_man: isWindows ? installPath : path.join(installPath, 'man'),
    NPM_CONFIG_MAN: isWindows ? installPath : path.join(installPath, 'man'),
    npm_config_prefix: installPath,
    NPM_CONFIG_PREFIX: installPath,
  };
};
