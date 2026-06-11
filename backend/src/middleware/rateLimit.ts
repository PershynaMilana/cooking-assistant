import type { RequestHandler } from "express";
import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

const passThroughLimiter: RequestHandler = (_req, _res, next) => {
    next();
};

export const authLimiter: RequestHandler = isTest
    ? passThroughLimiter
    : rateLimit({
          windowMs: 15 * 60 * 1000,
          limit: 10,
          standardHeaders: true,
          legacyHeaders: false,
          message: { error: "Too many requests, please try again later" },
      });
