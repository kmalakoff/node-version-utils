var path = require('path');
var endsWith = require('end-with');
var homedir = require('homedir-polyfill');

var constants = require('./constants');
var DELIMITER = constants.DELIMITER;

var HOME_DIR = homedir();
var NVM_DIR = path.join(HOME_DIR, '.nvm');
var NAVE_DIR = path.join(HOME_DIR, '.nave');
var NVM_WINDOWS_DIR = path.join(HOME_DIR, 'nvm');

var REMOVALS = [
  function (pathPart) {
    return endsWith(pathPart, 'nodejs');
  },
  function (pathPart) {
    return !pathPart.indexOf(NVM_DIR);
  },
  function (pathPart) {
    return !pathPart.indexOf(NAVE_DIR);
  },
  function (pathPart) {
    return !pathPart.indexOf(NVM_WINDOWS_DIR);
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
