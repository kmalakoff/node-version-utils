# node-version-utils

Prepare cross-platform child-process options for an installed Node.js version. It puts that version's `node` and `npm` first on `PATH` and sets the npm prefix.

## Install

```sh
npm install node-version-utils
```

## Use

```js
const { spawnOptions } = require('node-version-utils');
const { spawn } = require('child_process');

const options = spawnOptions('/path/to/node-install');
spawn('node', ['--version'], options).stdout.pipe(process.stdout);
```

Pass the installed version directory, not the path to its `node` executable. The returned options can be passed to Node's child-process APIs or compatible spawn libraries.
