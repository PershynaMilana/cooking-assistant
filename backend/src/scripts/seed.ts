import { logger } from "config/logger";

import { runSeed } from "./runSeed";

runSeed().catch((error: unknown) => {
    logger.error({ err: error }, "Seed failed");
    process.exitCode = 1;
});
