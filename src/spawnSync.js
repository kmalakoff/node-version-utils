const crossSpawn = require('cross-spawn-cb');
const spawnOptions = require('./spawnOptions');

module.exports = function spawnSync(installPath, command, args, options) {
  return crossSpawn.sync(command, args, spawnOptions(installPath, options));
};
