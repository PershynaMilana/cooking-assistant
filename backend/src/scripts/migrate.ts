import { logger } from "config/logger";

import { runMigrations } from "./runMigrations";

runMigrations(process.argv.slice(2)).catch((error: unknown) => {
    logger.error({ err: error }, "Migration failed");
    process.exitCode = 1;
});
