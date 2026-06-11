import type { NextFunction, Request, Response } from "express";

import { NotFoundError } from "@domain/errors/AppError";
import errorHandler from "../errorHandler";

function makeResponse(headersSent = false) {
    return {
        headersSent,
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
}

describe("errorHandler", () => {
    it("should respond with the AppError status and message", () => {
        const err = new NotFoundError("Recipe not found");
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Recipe not found" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should respond with 500 and the Error message for a regular Error", () => {
        const err = new Error("Database failed");
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database failed" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should respond with 500 and Server error for a non-Error", () => {
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler("broken", req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should pass the error to next when headers were sent", () => {
        const err = new Error("Too late");
        const req = {} as Request;
        const res = makeResponse(true);
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(res.status).not.toHaveBeenCalled();
    });
});
