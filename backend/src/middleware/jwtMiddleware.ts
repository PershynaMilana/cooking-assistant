import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { requireJwtSecret } from "@config/env";

function isUserPayload(
    decoded: string | JwtPayload | undefined,
): decoded is JwtPayload & {
    id: number;
} {
    const isObjectPayload = typeof decoded === "object" && decoded !== null;
    return isObjectPayload && typeof decoded.id === "number";
}

const authenticateToken: RequestHandler = (req, res, next) => {
    const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
        res.status(401).json({ error: "No token, access denied" });
        return;
    }

    // a missing secret is a server misconfiguration: the AppError(500) propagates to errorHandler
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
