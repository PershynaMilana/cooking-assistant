import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { AUTH_COOKIE_NAME } from "@config/cookie";
import { requireJwtSecret } from "@config/env";

function isUserPayload(
    decoded: string | JwtPayload | undefined,
): decoded is JwtPayload & {
    id: number;
} {
    const isObjectPayload = typeof decoded === "object" && decoded !== null;
    return (
        isObjectPayload &&
        typeof decoded.id === "number" &&
        Number.isInteger(decoded.id) &&
        decoded.id > 0
    );
}

const authenticateToken: RequestHandler = (req, res, next) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME]?.trim() ?? "";

    if (!token) {
        res.status(401).json({ error: "No token, access denied" });
        return;
    }

    const secret = requireJwtSecret();

    jwt.verify(token, secret, { algorithms: ["HS256"] }, (err, decoded) => {
        if (err || !isUserPayload(decoded)) {
            res.status(403).json({ error: "Token is invalid or expired" });
            return;
        }

        req.user = { id: decoded.id };
        next();
    });
};

export default authenticateToken;
