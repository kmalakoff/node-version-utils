var constants = require('./constants');
var NVS_PATH = constants.SEP + 'nvs' + constants.SEP + 'node';
var NVU_PATH = constants.SEP + '.nvu' + constants.SEP;

module.exports = function filterNVS(path) {
  // return true;
  return (path.indexOf(NVU_PATH) < 0) && (path.indexOf(NVS_PATH) < 0);
};
