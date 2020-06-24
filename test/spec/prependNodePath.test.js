var assert = require('assert');

var prependNodePath = require('../../lib/prependNodePath');
var constants = require('../../lib/constants');
var DELIMITER = constants.DELIMITER;

describe('prependNodePath', function () {
  describe('install path', function () {
    it('prepends - exists at front', function () {
      var envPaths = ['install/path', 'other/path', 'another/path'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 0);
      assert.equal(results.removed.length, 0);
      assert.equal(results.path, envPath);
    });

    it('prepends - removes extra', function () {
      var envPaths = ['install/path', 'other/path', 'another/path', 'install/path', 'other/path', 'another/path'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 0);
      assert.equal(results.removed.length, 1);
      envPaths.splice(3, 1);
      assert.equal(results.path, envPaths.join(DELIMITER));
    });

    it('prepends - removes extras', function () {
      var envPaths = ['install/path', 'other/path', 'another/path', 'install/path', 'other/path', 'another/path', 'install/path'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 0);
      assert.equal(results.removed.length, 2);
      envPaths.splice(6, 1);
      envPaths.splice(3, 1);
      assert.equal(results.path, envPaths.join(DELIMITER));
    });

    it('adds missing no entries', function () {
      var envPaths = ['other/path', 'another/path', 'other/path', 'another/path'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 1);
      assert.equal(results.removed.length, 0);
      assert.equal(results.path, 'install/path' + DELIMITER + envPaths.join(DELIMITER));
    });

    it('adds missing and removes middle', function () {
      var envPaths = ['other/path', 'another/path', 'install/path', 'other/path', 'another/path'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 1);
      assert.equal(results.removed.length, 1);
      envPaths.splice(2, 1);
      assert.equal(results.path, 'install/path' + DELIMITER + envPaths.join(DELIMITER));
    });
  });

  describe('nodejs', function () {
    it('prepends - exists at front', function () {
      var envPaths = ['install/path', 'other/path', 'windows/nodejs', 'another/path'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 0);
      assert.equal(results.removed.length, 1);
      envPaths.splice(2, 1);
      assert.equal(results.path, envPaths.join(DELIMITER));
    });

    it('prepends - removes extra', function () {
      var envPaths = ['install/path', 'other/path', 'another/path', 'install/path', 'other/path', 'another/path', 'windows/nodejs'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 0);
      assert.equal(results.removed.length, 2);
      envPaths.splice(6, 1);
      envPaths.splice(3, 1);
      assert.equal(results.path, envPaths.join(DELIMITER));
    });

    it('prepends - removes extras', function () {
      var envPaths = [
        'install/path',
        'other/path',
        'another/path',
        'install/path',
        'windows/nodejs',
        'other/path',
        'another/path',
        'install/path',
        'windows/nodejs',
      ];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 0);
      assert.equal(results.removed.length, 4);
      envPaths.splice(8, 1);
      envPaths.splice(7, 1);
      envPaths.splice(4, 1);
      envPaths.splice(3, 1);
      assert.equal(results.path, envPaths.join(DELIMITER));
    });

    it('adds missing no entries', function () {
      var envPaths = ['other/path', 'another/path', 'other/path', 'another/path', 'windows/nodejs'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 1);
      assert.equal(results.removed.length, 1);
      envPaths.splice(4, 1);
      assert.equal(results.path, 'install/path' + DELIMITER + envPaths.join(DELIMITER));
    });

    it('adds missing and removes middle', function () {
      var envPaths = ['other/path', 'another/path', 'install/path', 'other/path', 'windows/nodejs', 'another/path'];
      var envPath = envPaths.join(DELIMITER);

      var results = prependNodePath(envPath, 'install/path');
      assert.equal(results.added.length, 1);
      assert.equal(results.removed.length, 2);
      envPaths.splice(4, 1);
      envPaths.splice(2, 1);
      assert.equal(results.path, 'install/path' + DELIMITER + envPaths.join(DELIMITER));
    });
  });
});
