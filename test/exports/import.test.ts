import assert from 'assert';

import * as utils from 'node-version-utils';
import { spawnOptions } from 'node-version-utils';

describe('exports .ts', () => {
  it('exports on default', () => {
    assert.equal(typeof utils, 'object');
    assert.equal(typeof utils.spawnOptions, 'function');
  });

  it('named exports', () => {
    assert.equal(typeof spawnOptions, 'function');
  });
});
