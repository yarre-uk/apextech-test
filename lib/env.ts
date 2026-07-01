import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .refine(
      (v) => v.startsWith('file:'),
      'Must be a SQLite file URL (file:...)',
    ),
  APP_URL: z.url().default('http://localhost:3000'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

function parseEnv() {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      'Invalid environment variables:',
      z.prettifyError(result.error),
    );

    throw new Error('Invalid environment variables — check your .env file');
  }

  return result.data;
}

export const env = parseEnv();
