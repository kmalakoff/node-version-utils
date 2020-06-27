var constants = require('./constants');
var DELIMITER = constants.DELIMITER;

module.exports = function prependNodePath(envPath, binPath) {
  var results = { added: [], removed: [] };

  var pathParts = envPath.split(DELIMITER);
  if (!pathParts.length || pathParts[0] !== binPath) {
    results.added.push(binPath);
    pathParts.unshift(binPath);
  }
  for (var index = 1; index < pathParts.length; index++) {
    // remove
    var pathPart = pathParts[index];
    if (~pathPart.indexOf(binPath)) {
      results.removed.push(pathPart);
      pathParts.splice(index, 1);
      index--;
    }
  }

  results.path = pathParts.join(DELIMITER);
  return results;
};
