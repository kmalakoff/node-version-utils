var assert = require('assert');
var path = require('path');
// var rimraf = require('rimraf');
var isVersion = require('is-version');
var cr = require('cr');
var nodeInstall = require('node-install-release');

var versionUtils = require('../..');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var TMP_DIR = path.resolve(path.join(__dirname, '..', '..', '.tmp'));
var OPTIONS = {
  cacheDirectory: path.join(TMP_DIR, 'cache'),
  installedDirectory: path.join(TMP_DIR, 'installed'),
};

var VERSIONS = ['v14.1.0', 'v0.8.25'];

function addTests(version) {
  var INSTALL_DIR = path.resolve(path.join(OPTIONS.installedDirectory, version));

  describe(version, function () {
    before(function (callback) {
      nodeInstall(version, INSTALL_DIR, OPTIONS, callback);
    });

    it('npm --version', function (done) {
      versionUtils.spawn(INSTALL_DIR, 'npm', ['--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.ok(isVersion(lines.slice(-2, -1)[0]));
        done();
      });
    });

    it('node --version', function (done) {
      versionUtils.spawn(INSTALL_DIR, NODE, ['--version'], { stdout: 'string' }, function (err, res) {
        assert.ok(!err);
        var lines = cr(res.stdout).split('\n');
        assert.equal(lines.slice(-2, -1)[0], version);
        done();
      });
    });

    it('npm --version - promise', function (done) {
      if (typeof Promise === 'undefined') return done(); // no promise support

      versionUtils
        .spawn(INSTALL_DIR, 'npm', ['--version'], { stdout: 'string' })
        .then(function (res) {
          var lines = cr(res.stdout).split('\n');
          assert.ok(isVersion(lines.slice(-2, -1)[0]));
          done();
        })
        .catch(done);
    });

    it('node --version - promise', function (done) {
      if (typeof Promise === 'undefined') return done(); // no promise support

      versionUtils
        .spawn(INSTALL_DIR, NODE, ['--version'], { stdout: 'string' })
        .then(function (res) {
          var lines = cr(res.stdout).split('\n');
          assert.equal(lines.slice(-2, -1)[0], version);
          done();
        })
        .catch(done);
    });
  });
}

describe('spawn', function () {
  // before(function (callback) {
  //   rimraf(TMP_DIR, callback.bind(null, null));
  // });

  describe('happy path', function () {
    for (var i = 0; i < VERSIONS.length; i++) {
      addTests(VERSIONS[i]);
    }
  });

  // TODO
  describe('unhappy path', function () { });
});
