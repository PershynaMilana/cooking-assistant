import type { Request } from "express";

import { ERROR_MESSAGES } from "constants/errorMessages";

export function getUserId(req: Request): number {
    if (!req.user) {
        throw new Error(ERROR_MESSAGES.AUTHENTICATED_USER_MISSING);
    }

    return req.user.id;
}
