// file: src/middleware/errors.ts

import type { Express, Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

/**
 * Register terminal middleware:
 * - 404 handler for unmatched routes
 * - error handler for uncaught exceptions in request pipeline
 */
export function registerErrorHandlers(app: Express): void {
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "not_found" });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, "Unhandled Error");
    res.status(500).json({ error: "internal_error" });
  });
}
