declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET_KEY?: string;
            DB_USER?: string;
            DB_PASSWORD?: string;
            DB_HOST?: string;
            DB_PORT?: string;
            DB_NAME?: string;
            CORS_ORIGIN?: string;
            PORT?: string;
            LOG_LEVEL?: string;
        }
    }
}

export {};
