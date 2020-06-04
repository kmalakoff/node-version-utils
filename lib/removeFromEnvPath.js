var constants = require('./constants');
var PATH_KEY = constants.PATH_KEY;
var DELIMITER = constants.DELIMITER;

module.exports = function removeFromEnvPath(installPath) {
  var paths = process.env[PATH_KEY].split(DELIMITER)
  var results = [];
  for (var index = 0; index < paths.length; index++) {
    var path = paths[index]
    if (!~path.indexOf(installPath)) results.push(path)
  }
  return results.join(DELIMITER)
};
