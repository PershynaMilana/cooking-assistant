import pino from "pino";

const isTest = process.env.NODE_ENV === "test";

export const logger = pino({
    level: isTest ? "silent" : (process.env.LOG_LEVEL ?? "info"),
});
