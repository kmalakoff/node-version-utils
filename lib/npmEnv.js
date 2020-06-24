var path = require('path');

var isWindows = process.platform === 'win32';

module.exports = function npmEnv(installPath) {
  var env = {
    npm_config_binroot: isWindows ? installPath : path.join(installPath, 'bin'),
    npm_config_root: isWindows ? installPath : path.join(installPath, 'lib'),
    npm_config_man: isWindows ? installPath : path.join(installPath, 'man'),
    npm_config_prefix: installPath,
  };

  var result = {};
  for (var key in env) {
    result[key] = env[key];
    result[key.toUpperCase()] = env[key];
  }

  return result;
};
