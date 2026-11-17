// Pure parser for the configuration. It does NOT read process.env on import, so tests can import
// parseEnv freely. The loaded value lives in ./index.ts, the only module that touches process.env.
import { z } from 'zod';

const Env = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3001),
    DATABASE_URL: z.string().url(),
    OIDC_ISSUER: z.string().url(),
    OIDC_AUDIENCE: z.string().min(1),
    AUTH_DEV_BYPASS: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
  })
  .refine((e) => !(e.NODE_ENV === 'production' && e.AUTH_DEV_BYPASS), {
    message: 'AUTH_DEV_BYPASS must never be enabled in production',
    path: ['AUTH_DEV_BYPASS'],
  });

export type Env = z.infer<typeof Env>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = Env.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n  ');
    throw new Error(`Invalid configuration:\n  ${problems}`);
  }
  return result.data;
}
