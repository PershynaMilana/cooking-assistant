import type { Request } from "express";

export function getUserId(req: Request): number {
    if (!req.user) {
        throw new Error("Authenticated user is missing");
    }

    return req.user.id;
}
