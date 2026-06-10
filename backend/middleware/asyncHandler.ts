import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<unknown> | unknown;

const asyncHandler =
    (handler: AsyncRequestHandler): RequestHandler =>
    (req, res, next) =>
        Promise.resolve(handler(req, res, next)).catch(next);

export default asyncHandler;
