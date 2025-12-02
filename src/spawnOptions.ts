import pathKey from 'env-path-key';
import fs from 'fs';
import path from 'path';
import prepend from 'path-string-prepend';
import startsWithFn from './lib/startsWithFn.ts';

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';

const startsNPM = startsWithFn('npm_');
const startsPath = startsWithFn('path');

import type { ProcessEnv, SpawnOptions } from './types.ts';

export default function spawnOptions(installPath: string, options: SpawnOptions = {}): SpawnOptions {
  // Resolve symlinks to get real path (fixes nvm-windows symlink issues where
  // C:\nvm4w\nodejs points to the active Node version via symlink)
  try {
    installPath = fs.realpathSync(installPath);
  } catch (_e) {
    // Keep original path if resolution fails
  }

  const PATH_KEY = pathKey();
  const processEnv = process.env;
  const bin = isWindows ? installPath : path.join(installPath, 'bin');
  const env = {} as ProcessEnv;
  env.npm_node_execpath = path.join(bin, NODE);
  env.npm_config_prefix = installPath;

  // copy the environment not for npm and skip case-insesitive additional paths
  for (const key in processEnv) {
    // skip npm_ variants and non-matching path
    if (key.length > 4 && startsNPM(key)) continue;
    if (key.length === 4 && startsPath(key) && key !== PATH_KEY) continue;
    env[key] = processEnv[key];
  }

  // override node
  if (env.NODE !== undefined) env.NODE = env.npm_node_execpath;
  if (env.NODE_EXE !== undefined) env.NODE_EXE = env.npm_node_execpath;

  // put the path to node and npm at the front and remove nvs
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', bin) as string;
  return { ...options, cwd: process.cwd(), env } as SpawnOptions;
}
