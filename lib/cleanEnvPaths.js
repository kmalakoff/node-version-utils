var filter = require('lodash.filter');

var constants = require('./constants');
var PATH_KEY = constants.PATH_KEY;
var DELIMITER = constants.DELIMITER;
// var SEP = constants.SEP;
// var ANYS = [SEP + 'nodejs' + SEP, SEP + 'node' + SEP];

module.exports = function cleanEnvPaths(installPath) {
  return filter(process.env[PATH_KEY].split(DELIMITER), function (x) {
    if (x.indexOf(installPath) >= 0) return false;
    // for (var index = 0; index < ANYS.length; index++) {
    //   if (~x.indexOf(ANYS[index])) return false;
    // }
    return true;
  }).join(DELIMITER);
};
