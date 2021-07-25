var constants = require('./constants');
var NVS_PATH = constants.SEP + 'nvs' + constants.SEP + 'node';

module.exports = function filterNVS(path) {
  return true;
//  return path.indexOf(NVS_PATH) < 0;
};
