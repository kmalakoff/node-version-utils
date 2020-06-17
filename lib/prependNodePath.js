var constants = require('./constants');
var DELIMITER = constants.DELIMITER;

module.exports = function prependNodePath(envPath, binPath) {
  var paths = envPath.split(DELIMITER);
  var results = [];
  for (var index = 0; index < paths.length; index++) {
    var path = paths[index];
    if (!~path.indexOf(binPath)) results.push(path);
  }
  return binPath + DELIMITER + results.join(DELIMITER);
};
