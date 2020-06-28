var path = require('path');
var homedir = require('homedir-polyfill');

var constants = require('./constants');
var DELIMITER = constants.DELIMITER;
var HOME_DIR = homedir();
var NVU_POSIX_DIR = path.join(HOME_DIR, '.nvu');

var REMOVALS = [
  function nvu(pathPart) {
    return !pathPart.indexOf(NVU_POSIX_DIR);
  },
];

module.exports = function prependNodePath(envPath, binPath) {
  var results = { added: [], removed: [] };

  var pathParts = envPath.split(DELIMITER);
  if (!pathParts.length || pathParts[0] !== binPath) {
    results.added.push(binPath);
    pathParts.unshift(binPath);
  }
  for (var index = 1; index < pathParts.length; index++) {
    var pathPart = pathParts[index];

    // detect what to remove
    var remove = ~pathPart.indexOf(binPath);
    if (!remove) {
      for (var j = 0; j < REMOVALS.length; j++) {
        remove = REMOVALS[j](pathPart);
        if (remove) break;
      }
    }

    // remnove
    if (remove) {
      results.removed.push(pathPart);
      pathParts.splice(index, 1);
      index--;
    }
  }

  results.path = pathParts.join(DELIMITER);
  return results;
};
