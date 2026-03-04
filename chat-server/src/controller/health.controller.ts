// file: src/controller/health.controller.ts

import { Router, type Request, type Response } from "express";
import { pingMongo } from "../config/mongo.js";
import { pingRedis } from "../config/redis.js";
import { Routes } from "../config/routes.js";

export const healthRouter = Router();

/**
 * Health endpoint that validates process liveness and backing service connectivity.
 * - Returns 200 only if MongoDB and Redis are reachable.
 * - Returns 503 if either dependency check fails.
 */
healthRouter.get(Routes.HEALTH, async (_req: Request, res: Response) => {
  const startedAt = Date.now();

  const checks = {
    mongo: { ok: true as boolean, error: "" as string },
    redis: { ok: true as boolean, error: "" as string },
  };

  try {
    await pingMongo();
  } catch (e) {
    checks.mongo.ok = false;
    checks.mongo.error = e instanceof Error ? e.message : "unknown_error";
  }

  try {
    await pingRedis();
  } catch (e) {
    checks.redis.ok = false;
    checks.redis.error = e instanceof Error ? e.message : "unknown_error";
  }

  const ok = checks.mongo.ok && checks.redis.ok;
  const latencyMs = Date.now() - startedAt;

  if (!ok) {
    return res.status(503).json({
      ok: false,
      latencyMs,
      checks,
    });
  }

  return res.status(200).json({
    ok: true,
    latencyMs,
  });
});
