var isWindows = process.platform === 'win32';

var PATH_KEY = isWindows
  ? (function () {
      for (var key in process.env) {
        if (key.toUpperCase() === 'PATH') return key;
      }
      return 'Path';
    })()
  : 'PATH';

module.exports = {
  PATH_KEY: PATH_KEY,
  SEP: isWindows ? '\\' : '/',
  DELIMITER: isWindows ? ';' : ':',
  NODE: isWindows ? 'node.exe' : 'node',
};
