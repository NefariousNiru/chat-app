// file: src/app.ts

import express, { type Express } from "express";
import { requestLogger } from "./middleware/requestLogger.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import { registerErrorHandlers } from "./middleware/errors.js";
import { healthRouter } from "./controller/health.controller.js";

/**
 * Create and configure the Express application.
 * This function is deterministic and side effect free.
 */
export function createApp(): Express {
  const app = express();

  app.use(requestLogger());
  applySecurityMiddleware(app);
  app.use(healthRouter);

  registerErrorHandlers(app);
  return app;
}
