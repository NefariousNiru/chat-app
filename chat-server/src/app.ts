// file: src/app.ts

import express, { type Express, type Request, type Response } from "express";
import { requestLogger } from "./middleware/requestLogger.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import { registerErrorHandlers } from "./middleware/errors.js";

/**
 * Create and configure the Express application.
 * This function is deterministic and side effect free.
 */
export function createApp(): Express {
  const app = express();

  app.use(requestLogger());
  applySecurityMiddleware(app);

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  registerErrorHandlers(app);
  return app;
}
