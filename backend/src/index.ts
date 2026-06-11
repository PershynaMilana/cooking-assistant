import controllers from "./composition-root";
import pool from "./db";
import { createApp } from "./app";
import { config } from "@config/env";
import { logger } from "@config/logger";

const app = createApp(controllers);

const server = app.listen(config.port, () =>
    logger.info(`server listening on ${config.port}`),
);

function shutdown(signal: string) {
    logger.info(`${signal} received, shutting down`);
    server.close(() => {
        return pool.end().finally(() => process.exit(0));
    });

    // force-exit if connections do not drain in time
    setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
