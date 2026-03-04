// file: src/utils/logger.ts

import pino, { type Logger, type LoggerOptions } from "pino";
import { env, AppEnv } from "../config/env.js";

/**
 * Central logger configured for structured logging in production
 * and readable logs in development.
 */
function buildLoggerOptions(): LoggerOptions {
  const base: LoggerOptions = {
    level: "info",
    base: {
      service: "chat-server",
      env: env.NODE_ENV,
    },
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
        "req.body.refreshToken",
        "password",
        "refreshToken",
        "token",
        "secret",
        "JWT_SECRET",
      ],
      remove: true,
    },
  };

  if (env.NODE_ENV !== AppEnv.Production) {
    base.transport = {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:standard",
        singleLine: true,
        colorize: true,
        ignore: "pid,hostname,req.headers,res.headers",
      },
    };
  }

  return base;
}

export const logger: Logger = pino(buildLoggerOptions());
