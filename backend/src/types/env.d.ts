declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET_KEY?: string;
            DB_USER?: string;
            DB_PASSWORD?: string;
            DB_HOST?: string;
            DB_PORT?: string;
            DB_NAME?: string;
            PORT?: string;
        }
    }
}

export {};
