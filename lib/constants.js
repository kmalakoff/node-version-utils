var isWindows = process.platform === 'win32';

function windowsPathKey() {
  var pathKey = 'Path';

  for (var key in process.env) {
    if (key.toUpperCase() === 'PATH') {
      pathKey = key;
      if (pathKey !== 'PATH') return key; // 'which' in cross-spawn uses PATH in windows, but this causes issues in repeat spawn calls given PATH get propagated so PATH_KEY needs to select 'Path' over 'PATH' if both exist
    }
  }
  return pathKey;
}

module.exports = {
  PATH_KEY: isWindows ? windowsPathKey() : 'PATH',
  NODE: isWindows ? 'node.exe' : 'node',
};
