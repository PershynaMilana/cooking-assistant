import "dotenv/config";

import { z } from "zod";

import { AppError } from "@domain/errors/AppError";

function emptyToUndefined(value: unknown): unknown {
    const isEmptyInput = value === undefined || value === null || value === "";

    return isEmptyInput ? undefined : value;
}

const envNumberSchema = (fallback: number) =>
    z.preprocess(
        emptyToUndefined,
        z.coerce
            .number({
                invalid_type_error: "must be a number",
            })
            .int("must be an integer")
            .positive("must be positive")
            .default(fallback),
    );

const envStringSchema = (fallback: string) =>
    z.preprocess(emptyToUndefined, z.string().default(fallback));

const envSchema = z.object({
    NODE_ENV: envStringSchema("development"),
    PORT: envNumberSchema(3000),
    DB_USER: envStringSchema("postgres"),
    DB_PASSWORD: envStringSchema("12345678"),
    DB_HOST: envStringSchema("localhost"),
    DB_PORT: envNumberSchema(5432),
    DB_NAME: envStringSchema("cooking_helper"),
    CORS_ORIGIN: envStringSchema("http://localhost:8080"),
    COOKIE_DOMAIN: z.preprocess(emptyToUndefined, z.string().optional()),
    JWT_SECRET_KEY: z.preprocess(
        emptyToUndefined,
        z.string().min(32, "must be at least 32 characters").optional(),
    ),
    LOG_LEVEL: z
        .preprocess(
            emptyToUndefined,
            z
                .enum([
                    "fatal",
                    "error",
                    "warn",
                    "info",
                    "debug",
                    "trace",
                    "silent",
                ])
                .default("info"),
        )
        .optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    const message = parsedEnv.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

    throw new Error(`Invalid environment configuration: ${message}`);
}

const env = parsedEnv.data;

export const config = {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === "production",
    db: {
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
    },
    corsOrigin: env.CORS_ORIGIN,
    cookieDomain: env.COOKIE_DOMAIN,
    logLevel: env.LOG_LEVEL ?? "info",
};

export function requireJwtSecret(): string {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new AppError("JWT secret is not configured", 500);
    }

    return secret;
}
