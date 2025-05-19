import path from 'path';
import pathKey from 'env-path-key';
import prepend from 'path-string-prepend';
import startsWithFn from './lib/startsWithFn.js';

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODE = isWindows ? 'node.exe' : 'node';

const startsNPM = startsWithFn('npm_');
const startsPath = startsWithFn('path');

import type { ProcessEnv, SpawnOptions } from './types.js';

export default function spawnOptions(installPath: string, options: object = {}): SpawnOptions {
  const PATH_KEY = pathKey();
  const processEnv = process.env;
  const env = {} as ProcessEnv;
  env.npm_config_binroot = isWindows ? installPath : path.join(installPath, 'bin');
  env.npm_config_root = isWindows ? installPath : path.join(installPath, 'lib');
  env.npm_config_man = isWindows ? installPath : path.join(installPath, 'man');
  env.npm_config_prefix = installPath;
  env.npm_node_execpath = path.join(env.npm_config_binroot, NODE);

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
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot) as string;
  return { ...options, cwd: process.cwd(), env } as SpawnOptions;
}
