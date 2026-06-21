import type { NextFunction, Request, Response } from "express";

import { AppError, NotFoundError } from "domain/errors/AppError";

import errorHandler from "middleware/errorHandler";

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

    it("should hide the message of an AppError with a 5xx status", () => {
        const err = new AppError("JWT secret is not configured", 500);
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should hide the Error message behind Server error for a regular Error", () => {
        const err = new Error("duplicate key value violates unique constraint");
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should keep the Error message for a non-AppError with a 4xx status", () => {
        const err = Object.assign(new Error("Unexpected token in JSON"), {
            status: 400,
        });
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Unexpected token in JSON",
        });
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

    it("should use 500 when the error object has a numeric status of 0", () => {
        const err = Object.assign({}, { status: 0 });
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });

    it("should return Server error when the Error message is empty with a 4xx status", () => {
        const err = Object.assign(new Error(""), { status: 422 });
        const req = {} as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
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
