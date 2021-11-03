var path = require('path');
var assign = require('object-assign');
var prepend = require('path-string-prepend');
var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var PATH_KEY = require('./env-path-key')();

var isWindows = process.platform === 'win32';

module.exports = function envForInstallPath(installPath, options) {
  var processEnv = process.env;
  var env = {};
  env.npm_config_binroot = isWindows ? installPath : path.join(installPath, 'bin');
  env.npm_config_root = isWindows ? installPath : path.join(installPath, 'lib');
  env.npm_config_man = isWindows ? installPath : path.join(installPath, 'man');
  env.npm_config_prefix = installPath;
  env.npm_node_execpath = path.join(env.npm_config_binroot, NODE);

  // copy the environment not for npm and skip case-insesitive additional paths
  for (var key in processEnv) {
    var lowerKey = key.toLowerCase();
    if (lowerKey.indexOf('npm_') === 0) continue;
    if (lowerKey === 'path' && key !== PATH_KEY) continue;
    env[key] = processEnv[key];
  }

  // override node
  if (env.NODE !== undefined) env.NODE = env.npm_node_execpath;

  // put the path to node and npm at the front and remove nvs
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot);
  return assign({}, options, { cwd: process.cwd(), env: env, execPath: env.npm_node_execpath, path: env[PATH_KEY] });
};
