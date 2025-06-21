export type { SpawnOptions } from 'cross-spawn-cb';

export interface ProcessEnv extends NodeJS.ProcessEnv {
  npm_config_prefix: string;
  npm_node_execpath: string;
  NODE: string;
  NODE_EXE?: string;
}
