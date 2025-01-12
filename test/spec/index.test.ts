// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import cr from 'cr';
import crossSpawn from 'cross-spawn-cb';
import spawn from 'cross-spawn-cb';
import isVersion from 'is-version';
import nodeInstall from 'node-install-release';
import resolveVersions from 'node-resolve-versions';
import rimraf2 from 'rimraf2';

// @ts-ignore
import { spawnOptions } from 'node-version-utils';

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
        spawn('npm', ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }), (err, res) => {
          if (err) return done(err);
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
          done();
        });
      });

      it('node --version', (done) => {
        spawn(NODE, ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }), (err, res) => {
          if (err) return done(err);
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        });
      });
    });

    describe('spawn.sync', () => {
      it('npm --version', () => {
        const res = spawn.sync('npm', ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        const resultVersion = lines.slice(-2, -1)[0];
        assert.ok(isVersion(resultVersion));
      });

      it('node --version', () => {
        const res = spawn.sync(NODE, ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        assert.equal(lines.slice(-2, -1)[0], version);
      });
    });

    describe('spawnOptions', () => {
      it('npm --version', (done) => {
        crossSpawn('npm', ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }), (err, res) => {
          if (err) return done(err);
          const lines = cr(res.stdout).split('\n');
          const resultVersion = lines.slice(-2, -1)[0];
          assert.ok(isVersion(resultVersion));
          done();
        });
      });

      it('node --version', (done) => {
        crossSpawn(NODE, ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }), (err, res) => {
          if (err) return done(err);
          const lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        });
      });

      it('npm --version', () => {
        const res = crossSpawn.sync('npm', ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        const resultVersion = lines.slice(-2, -1)[0];
        assert.ok(isVersion(resultVersion));
      });

      it('node --version', () => {
        const res = crossSpawn.sync(NODE, ['--version'], spawnOptions(installPath, { silent: true, encoding: 'utf8' }));
        const lines = cr(res.stdout).split('\n');
        assert.equal(lines.slice(-2, -1)[0], version);
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
