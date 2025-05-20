import type cp from 'child_process';

export type SpawnOptions = cp.SpawnOptions;
export interface ProcessEnv extends NodeJS.ProcessEnv {
  npm_config_prefix: string;
  npm_node_execpath: string;
  NODE: string;
  NODE_EXE?: string;
}
