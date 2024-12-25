// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const isVersion = require('is-version');
const cr = require('cr');
const nodeInstall = require('node-install-release');
const crossSpawn = require('cross-spawn-cb');
const resolveVersions = require('node-resolve-versions');
const rimraf2 = require('rimraf2');

const versionUtils = require('node-version-utils');

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';
const TMP_DIR = path.resolve(path.join(__dirname, '..', '..', '.tmp'));
const OPTIONS = {
  cacheDirectory: path.join(TMP_DIR, 'cache'),
  installedDirectory: path.join(TMP_DIR, 'installed'),
};
const VERSIONS = resolveVersions.sync('>=0.8', { range: 'major,even' });

function addTests(version) {
  const INSTALL_DIR = path.resolve(path.join(OPTIONS.installedDirectory, version));

  describe(version, () => {
    before((callback) => {
      nodeInstall(version, INSTALL_DIR, OPTIONS, (err) => {
        callback(err);
      });
    });

    describe('spawn', () => {
      it('npm --version', (done) => {
        versionUtils.spawn(INSTALL_DIR, 'npm', ['--version'], { silent: true, encoding: 'utf8' }, (err, res) => {
          assert.ok(!err, err ? err.message : '');
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
          done();
        });
      });

      it('node --version', (done) => {
        versionUtils.spawn(INSTALL_DIR, NODE, ['--version'], { silent: true, encoding: 'utf8' }, (err, res) => {
          assert.ok(!err, err ? err.message : '');
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        });
      });

      it('npm --version - promise', (done) => {
        versionUtils
          .spawn(INSTALL_DIR, 'npm', ['--version'], { silent: true, encoding: 'utf8' })
          .then((res) => {
            const lines = cr(res.stdout).split('\n');
            const resultVersion = lines.slice(-2, -1)[0];
            assert.ok(isVersion(resultVersion));
            done();
          })
          .catch(done);
      });

      it('node --version - promise', (done) => {
        versionUtils
          .spawn(INSTALL_DIR, NODE, ['--version'], { silent: true, encoding: 'utf8' })
          .then((res) => {
            const lines = cr(res.stdout).split('\n');
            assert.equal(lines.slice(-2, -1)[0], version);
            done();
          })
          .catch(done);
      });
    });

    describe('spawnSync', () => {
      it('npm --version', () => {
        try {
          const res = versionUtils.spawnSync(INSTALL_DIR, 'npm', ['--version'], { silent: true, encoding: 'utf8' });
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
        } catch (err) {
          assert.ok(!err, err ? err.message : '');
        }
      });

      it('node --version', () => {
        try {
          const res = versionUtils.spawnSync(INSTALL_DIR, NODE, ['--version'], { silent: true, encoding: 'utf8' });
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
        } catch (err) {
          assert.ok(!err, err ? err.message : '');
        }
      });
    });

    describe('spawnOptions', () => {
      it('npm --version', (done) => {
        crossSpawn('npm', ['--version'], versionUtils.spawnOptions(INSTALL_DIR, { silent: true, encoding: 'utf8' }), (err, res) => {
          assert.ok(!err, err ? err.message : '');
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
          done();
        });
      });

      it('node --version', (done) => {
        crossSpawn(NODE, ['--version'], versionUtils.spawnOptions(INSTALL_DIR, { silent: true, encoding: 'utf8' }), (err, res) => {
          assert.ok(!err, err ? err.message : '');
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        });
      });

      it('npm --version', () => {
        try {
          const res = crossSpawn.sync('npm', ['--version'], versionUtils.spawnOptions(INSTALL_DIR, { silent: true, encoding: 'utf8' }));
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
        } catch (err) {
          assert.ok(!err, err ? err.message : '');
        }
      });

      it('node --version', () => {
        try {
          const res = crossSpawn.sync(NODE, ['--version'], versionUtils.spawnOptions(INSTALL_DIR, { silent: true, encoding: 'utf8' }));
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
        } catch (err) {
          assert.ok(!err, err ? err.message : '');
        }
      });
    });
  });
}

describe('node-version-utils', () => {
  before((cb) => rimraf2(TMP_DIR, { disableGlob: true }, cb.bind(null, null)));

  describe('happy path', () => {
    for (let i = 0; i < VERSIONS.length; i++) {
      addTests(VERSIONS[i]);
    }
  });

  // TODO
  describe('unhappy path', () => {});
});
