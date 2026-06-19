import type { RequestHandler } from "express";
import rateLimit from "express-rate-limit";

export function createLimiter(testMode: boolean): RequestHandler {
    if (testMode) {
        return (_req, _res, next) => {
            next();
        };
    }

    return rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: "Too many requests, please try again later" },
    });
}

export const authLimiter = createLimiter(process.env.NODE_ENV === "test");
