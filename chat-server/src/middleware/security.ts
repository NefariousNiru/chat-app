// file: src/middleware/security.ts

import type { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import express from "express";
import { env } from "../config/env.js";

/**
 * Apply baseline security middleware and hard limits.
 * - Disables x-powered-by to reduce fingerprinting.
 * - Helmet for sensible HTTP security headers.
 * - CORS restricted to configured origin.
 * - JSON body size limit to prevent memory pressure and abuse.
 * - Global rate limiting for basic protection.
 */
export function applySecurityMiddleware(app: Express): void {
  app.disable("x-powered-by");

  if (env.TRUST_PROXY) {
    // Enables correct client IP and protocol detection behind a reverse proxy.
    app.set("trust proxy", 1);
  }

  app.use(helmet());

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: env.HTTP_JSON_BODY_LIMIT }));

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 600,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
}
