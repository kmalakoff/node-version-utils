var path = require('path');
var endsWith = require('end-with');
var homedir = require('homedir-polyfill');

var constants = require('./constants');
var DELIMITER = constants.DELIMITER;

var HOME_DIR = homedir();
var NVM_POSIX_DIR = path.join(HOME_DIR, '.nvm');
var NAVE_POSIX_DIR = path.join(HOME_DIR, '.nave');
var NVS_POSIX_DIR = path.join(HOME_DIR, '.nvs');
var LOCALAPPDATA_DIR = process.env.LOCALAPPDATA === undefined ? path.join(HOME_DIR, 'AppData', 'Local') : process.env.LOCALAPPDATA;

var NVM_WINDOWS_DIR = path.join(HOME_DIR, 'nvm');
var NVS_WINDOWS_DIR = path.join(LOCALAPPDATA_DIR, 'nvs');

var REMOVALS_POSIX = [
  function nvmPosix(pathPart) {
    return !pathPart.indexOf(NVM_POSIX_DIR);
  },
  function navePosix(pathPart) {
    return !pathPart.indexOf(NAVE_POSIX_DIR);
  },
  function nvsPosix(pathPart) {
    return !pathPart.indexOf(NVS_POSIX_DIR);
  },
];
var REMOVALS_WINDOWS = [
  function nodeWindows(pathPart) {
    return endsWith(pathPart, 'nodejs');
  },
  function nvsWindows(pathPart) {
    return !pathPart.indexOf(NVS_WINDOWS_DIR);
  },
  function nvmWindows(pathPart) {
    return !pathPart.indexOf(NVM_WINDOWS_DIR);
  },
];
var REMOVALS = process.platform === 'win32' ? REMOVALS_WINDOWS : REMOVALS_POSIX;

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
