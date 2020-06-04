var isWindows = process.platform === 'win32';

module.exports = function npmEnv(installPath) {
    return {
        npm_config_prefix: installPath,
        npm_config_binroot: isWindows ? installPath : path.join(installPath, 'bin'),
        npm_config_root: isWindows ? installPath : path.join(installPath, 'lib'),
        npm_config_man: isWindows ? installPath : path.join(installPath, 'man'),
    }
};
