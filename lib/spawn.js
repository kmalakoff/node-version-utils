var crossSpawn = require('cross-spawn-cb');

var spawnOptions = require('./spawnOptions');

function spawn(installPath, command, args, options, callback) {
  crossSpawn(command, args, spawnOptions(installPath, options), callback);
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
