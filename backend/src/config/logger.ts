import pino from "pino";

import { config } from "@config/env";

const isTest = process.env.NODE_ENV === "test";

export const logger = pino({
    level: isTest ? "silent" : config.logLevel,
});
