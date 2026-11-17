// The only place that reads process.env. Importing this module validates the configuration and
// fails at boot listing everything that is missing, so a bad deploy dies on startup, not on the
// first request. Tests import parseEnv from ./env.js instead.
import { parseEnv } from './env.js';

export const env = parseEnv(process.env);
export type { Env } from './env.js';
