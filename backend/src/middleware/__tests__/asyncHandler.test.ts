import type { NextFunction, Request, Response } from "express";

import asyncHandler from "../asyncHandler";

describe("asyncHandler", () => {
    it("should not call next with an error when the handler resolves", async () => {
        const handler = jest.fn().mockResolvedValue(undefined);
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        await asyncHandler(handler)(req, res, next);

        expect(handler).toHaveBeenCalledWith(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });

    it("should pass a thrown error to next", async () => {
        const error = new Error("Boom");
        const handler = jest.fn(async () => {
            throw error;
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        await asyncHandler(handler)(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it("should pass a rejected error to next", async () => {
        const error = new Error("Rejected");
        const handler = jest.fn().mockRejectedValue(error);
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        await asyncHandler(handler)(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
