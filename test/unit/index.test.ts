// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import cr from 'cr';
import crossSpawn from 'cross-spawn-cb';
import spawn from 'cross-spawn-cb';
import pathKey from 'env-path-key';
import fs from 'fs';
import { safeRm } from 'fs-remove-compat';
import isVersion from 'is-version';
import nodeInstall from 'node-install-release';
import * as resolveVersions from 'node-resolve-versions';
import { spawnOptions } from 'node-version-utils';
import path from 'path';
import url from 'url';

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TMP_DIR = path.join(path.join(__dirname, '..', '..', '.tmp'));
const OPTIONS = {
  storagePath: path.join(TMP_DIR),
};
const VERSIONS = resolveVersions.sync('>=20', { range: 'major,even' });

function addTests(version) {
  describe(version, () => {
    let installPath = null;
    before((cb) =>
      nodeInstall(version, { name: version, ...OPTIONS }, (err, res) => {
        installPath = res ? res.installPath : null;
        cb(err);
      })
    );

    describe('spawn', () => {
      it('npm --version', (done) => {
        spawn('npm', ['--version'], spawnOptions(installPath, { encoding: 'utf8' }), (err, res) => {
          if (err) {
            done(err);
            return;
          }
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
          done();
        });
      });

      it('node --version', (done) => {
        spawn(NODE, ['--version'], spawnOptions(installPath, { encoding: 'utf8' }), (err, res) => {
          if (err) {
            done(err);
            return;
          }
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        });
      });
    });

    describe('spawn.sync', () => {
      it('npm --version', () => {
        const res = spawn.sync('npm', ['--version'], spawnOptions(installPath, { encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        const resultVersion = lines.slice(-2, -1)[0];
        assert.ok(isVersion(resultVersion));
      });

      it('node --version', () => {
        const res = spawn.sync(NODE, ['--version'], spawnOptions(installPath, { encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        assert.equal(lines.slice(-2, -1)[0], version);
      });
    });

    describe('spawnOptions', () => {
      it('npm --version', (done) => {
        crossSpawn('npm', ['--version'], spawnOptions(installPath, { encoding: 'utf8' }), (err, res) => {
          if (err) {
            done(err);
            return;
          }
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
          done();
        });
      });

      it('node --version', (done) => {
        crossSpawn(NODE, ['--version'], spawnOptions(installPath, { encoding: 'utf8' }), (err, res) => {
          if (err) {
            done(err);
            return;
          }
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        });
      });

      it('npm --version', () => {
        const res = crossSpawn.sync('npm', ['--version'], spawnOptions(installPath, { encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        const resultVersion = lines.slice(-2, -1)[0];
        assert.ok(isVersion(resultVersion));
      });

      it('node --version', () => {
        const res = crossSpawn.sync(NODE, ['--version'], spawnOptions(installPath, { encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        assert.equal(lines.slice(-2, -1)[0], version);
      });

      it('should merge options.env with constructed env', () => {
        const PATH_KEY = pathKey();
        const opts = spawnOptions(installPath, { env: { CUSTOM_VAR: 'test', [PATH_KEY]: process.env[PATH_KEY] } });
        assert.equal(opts.env.CUSTOM_VAR, 'test');
        assert.equal(opts.env.npm_config_prefix, installPath); // constructed env preserved
      });

      it('should throw when options.env lacks PATH', () => {
        const PATH_KEY = pathKey();
        const customEnv = { CUSTOM_VAR: 'test' }; // no PATH - this is incorrect usage
        try {
          spawnOptions(installPath, { env: customEnv });
          assert.ok(false, 'Expected an error to be thrown');
        } catch (err) {
          assert.equal(err.message, `node-version-utils: options.env missing required ${PATH_KEY}`);
        }
      });
    });

    describe('symlink resolution', () => {
      let symlinkPath = null;

      before(() => {
        // Create a symlink to the installPath (like nvm-windows does)
        symlinkPath = path.join(TMP_DIR, 'symlink-test');
        try {
          fs.unlinkSync(symlinkPath);
        } catch (_e) {
          // ignore if doesn't exist
        }
        fs.symlinkSync(installPath, symlinkPath, 'junction');
      });

      after(() => {
        try {
          fs.unlinkSync(symlinkPath);
        } catch (_e) {
          // ignore
        }
      });

      it('resolves symlink in npm_config_prefix', () => {
        const opts = spawnOptions(symlinkPath, {});
        // Should use resolved path, not symlink path
        assert.equal(opts.env.npm_config_prefix, installPath);
      });

      it('resolves symlink in npm_node_execpath', () => {
        const opts = spawnOptions(symlinkPath, {});
        const expectedBin = isWindows ? installPath : path.join(installPath, 'bin');
        const expectedNodePath = path.join(expectedBin, NODE);
        assert.equal(opts.env.npm_node_execpath, expectedNodePath);
      });

      it('node works via symlink path', (done) => {
        spawn(NODE, ['--version'], spawnOptions(symlinkPath, { encoding: 'utf8' }), (err, res) => {
          if (err) {
            done(err);
            return;
          }
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        });
      });
    });
  });
}

describe('node-version-utils', () => {
  before((cb) => safeRm(TMP_DIR, cb));

  describe('happy path', () => {
    for (let i = 0; i < VERSIONS.length; i++) {
      addTests(VERSIONS[i]);
    }
  });

  // TODO
  describe('unhappy path', () => {});
});
