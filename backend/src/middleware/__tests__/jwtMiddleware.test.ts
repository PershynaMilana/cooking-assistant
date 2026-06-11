import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import authenticateToken from "../jwtMiddleware";

function makeResponse() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
}

describe("jwtMiddleware", () => {
    const originalSecret = process.env.JWT_SECRET_KEY;

    afterEach(() => {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET_KEY;
            return;
        }

        process.env.JWT_SECRET_KEY = originalSecret;
    });

    it("should return 401 when authorization header is missing", () => {
        const req = { headers: {} } as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "No token, access denied",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when token is invalid", () => {
        const req = {
            headers: { authorization: "Bearer broken-token" },
        } as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: "Token is invalid or expired",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when token is expired", () => {
        const token = jwt.sign(
            { id: 7 },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: -1 },
        );
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: "Token is invalid or expired",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when JWT secret is missing", () => {
        const token = jwt.sign({ id: 7 }, process.env.JWT_SECRET_KEY as string);
        delete process.env.JWT_SECRET_KEY;
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: "Token is invalid or expired",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should attach the user and call next when token has a numeric id", () => {
        const token = jwt.sign({ id: 7 }, process.env.JWT_SECRET_KEY as string);
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        authenticateToken(req, res, next);

        expect(req.user).toEqual({ id: 7 });
        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 403 when token id is not numeric", () => {
        const token = jwt.sign(
            { id: "7" },
            process.env.JWT_SECRET_KEY as string,
        );
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as Request;
        const res = makeResponse();
        const next = jest.fn() as NextFunction;

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: "Token is invalid or expired",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
