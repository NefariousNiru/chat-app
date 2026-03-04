// file: src/index.ts

import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { createApp } from "./app.js";

/**
 * Process entrypoint.
 * Boots HTTP server with validated configuration.
 */
async function main(): Promise<void> {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "HTTP server listening");
  });

  const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutdown requested");
    server.close((err?: Error) => {
      if (err) {
        logger.error({ err }, "HTTP server close failed");
        process.exit(1);
      }
      logger.info("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.fatal({ err }, "Fatal boot error");
  process.exit(1);
});
