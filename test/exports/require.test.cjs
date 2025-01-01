const assert = require('assert');
const utils = require('cross-spawn-cb');

describe('exports .cjs', () => {
  it('exports on spawn', () => {
    it('exports on default', () => {
      assert.equal(typeof utils, 'object');
      assert.equal(typeof utils.spawnOptions, 'function');
    });
  });
});
