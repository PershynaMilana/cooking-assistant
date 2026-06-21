import type { NextFunction, Request, Response } from "express";

import { createLimiter } from "middleware/rateLimit";

describe("createLimiter", () => {
    it("should call next in test mode", () => {
        const limiter = createLimiter(true);
        const next = jest.fn() as NextFunction;

        limiter({} as Request, {} as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should return the rate limiter middleware in production mode", () => {
        const limiter = createLimiter(false);

        expect(typeof limiter).toBe("function");
    });
});
