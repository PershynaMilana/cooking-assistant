import type { ErrorRequestHandler } from "express";

import { logger } from "@config/logger";
import { AppError } from "@domain/errors/AppError";

function getErrorStatus(err: unknown): number {
    if (err instanceof AppError) {
        return err.status;
    }

    const hasStatus =
        typeof err === "object" && err !== null && "status" in err;

    if (hasStatus) {
        const { status } = err as { status?: unknown };
        if (typeof status === "number") {
            return status || 500;
        }
    }

    return 500;
}

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message || "Server error";
    }

    return "Server error";
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    logger.error(err);

    if (res.headersSent) {
        return _next(err);
    }

    res.status(getErrorStatus(err)).json({ error: getErrorMessage(err) });
};

export default errorHandler;
