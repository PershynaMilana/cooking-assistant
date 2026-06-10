import "dotenv/config";

import { AppError } from "../domain/errors/AppError";

export const config = {
    port: Number(process.env.PORT) || 8080,
    db: {
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "12345678",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || "cooking_helper",
    },
};

export function requireJwtSecret(): string {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new AppError("JWT secret is not configured", 500);
    }

    return secret;
}
