// file: src/config/env.ts

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

/**
 * Application runtime environments.
 * This enum is used as the single source of truth for allowed NODE_ENV values.
 */
export enum AppEnv {
  Development = "development",
  Test = "test",
  Production = "production",
}

/**
 * Loads environment variables from .env during local development and test runs.
 * In production, environment variables are expected to be provided by the runtime.
 *
 * The load happens at module evaluation time so validation always sees a populated process.env.
 */
(function loadDotenv(): void {
  if (process.env.NODE_ENV === AppEnv.Production) return;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.resolve(__dirname, "..", "..", ".env");

  const result = dotenv.config({ path: envPath, override: true });
  if (result.error) {
    console.error(`Failed to load .env from ${envPath}`, result.error);
  }
})();

/**
 * Environment configuration validated at process startup.
 * Fail-fast avoids undefined behavior and partial boot states.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(AppEnv).default(AppEnv.Development),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  // Network/security
  CORS_ORIGIN: z.string().min(1),
  TRUST_PROXY: z.coerce.boolean().default(false),

  // Data stores
  MONGO_URI: z.string().min(1),
  MONGO_DB: z.string().min(1),
  REDIS_URL: z.string().min(1),

  // JWT settings
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),

  // Limits
  HTTP_JSON_BODY_LIMIT: z.string().default("64kb"),
});

export type Env = Readonly<z.infer<typeof EnvSchema>>;

/**
 * Parse env variables and throw is failed
 */
function parseEnv(input: NodeJS.ProcessEnv): Env {
  const parsed = EnvSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${z.treeifyError(parsed.error)}`);
  }
  return Object.freeze(parsed.data);
}

/**
 * Singleton env config for the process lifetime.
 */
export const env: Env = parseEnv(process.env);
