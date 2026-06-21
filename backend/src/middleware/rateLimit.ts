import type { RequestHandler } from "express";
import rateLimit from "express-rate-limit";

import { AUTH_RATE_LIMIT, GLOBAL_RATE_LIMIT } from "config/security";

export function createLimiter(testMode: boolean): RequestHandler {
    if (testMode) {
        return (_req, _res, next) => {
            next();
        };
    }

    return rateLimit(AUTH_RATE_LIMIT);
}

export const authLimiter = createLimiter(process.env.NODE_ENV === "test");

// built per app instance so each createApp() gets its own counter (no cross-test bleed).
// deliberately NOT test-bypassed like authLimiter: an integration test asserts the live
// RateLimit-Limit header, and the per-window cap is far above any single test's request
// count, so it never trips the suite
export function createGlobalLimiter(): RequestHandler {
    return rateLimit(GLOBAL_RATE_LIMIT);
}
