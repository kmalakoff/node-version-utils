var isWindows = process.platform === 'win32';

module.exports = function pathKey(env) {
  if (!isWindows && env.PATH !== undefined) return 'PATH';

  var pathKey = 'Path';
  for (var key in process.env) {
    if (key.toUpperCase() !== 'PATH') continue;
    if (key !== 'PATH') return key; // use non-PATH when exists over other variants unless there are none
    pathKey = key;
  }
  return pathKey;
};
