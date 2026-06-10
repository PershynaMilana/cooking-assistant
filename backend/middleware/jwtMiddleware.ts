import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { requireJwtSecret } from "../config/env";

function isUserPayload(
    decoded: string | JwtPayload | undefined,
): decoded is JwtPayload & {
    id: number;
} {
    const isObjectPayload = typeof decoded === "object" && decoded !== null;
    return isObjectPayload && typeof decoded.id === "number";
}

const authenticateToken: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "No token, access denied" });
        return;
    }

    let secret: string;
    try {
        secret = requireJwtSecret();
    } catch {
        res.status(403).json({ message: "Token is invalid or expired" });
        return;
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err || !isUserPayload(decoded)) {
            res.status(403).json({ message: "Token is invalid or expired" });
            return;
        }

        req.user = { id: decoded.id };
        next();
    });
};

export default authenticateToken;
