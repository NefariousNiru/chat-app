// file: src/middleware/requestLogger.ts

import type { Request, Response, NextFunction } from "express";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

type PinoHttpFactory = (opts?: unknown) => ExpressMiddleware;

const require = createRequire(import.meta.url);
const pinoHttp = require("pino-http") as PinoHttpFactory;

/**
 * Minimal access logging:
 * - Skips /health and OPTIONS
 * - Adds/propagates x-request-id
 * - Logs method, url, status, response time only
 * - /health is not logged
 */
export function requestLogger(): ExpressMiddleware {
  return pinoHttp({
    logger,
    genReqId: (req: Request, res: Response) => {
      const existing = req.headers["x-request-id"];
      const id = typeof existing === "string" && existing.length > 0 ? existing : randomUUID();
      res.setHeader("x-request-id", id);
      return id;
    },
    autoLogging: {
      ignore: (req: Request) => req.method === "OPTIONS" || req.url === "/health",
    },
    customLogLevel: (_req: Request, res: Response, err?: Error) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    customSuccessMessage: (req: Request, res: Response) =>
      `${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req: Request, res: Response, err: Error) =>
      `${req.method} ${req.url} ${res.statusCode} ${err.message}`,
    serializers: {
      req: (req: Request) => ({
        id: (req as unknown as { id?: string }).id,
        method: req.method,
        url: req.url,
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  });
}
