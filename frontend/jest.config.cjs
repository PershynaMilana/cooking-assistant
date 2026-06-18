/** @type {import("jest").Config} */
module.exports = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
    setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    moduleNameMapper: {
        // env mock must win for both relative and bare `config/env` imports
        "^(.*/)?config/env$": "<rootDir>/src/test/envMock.ts",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(svg|png|jpg|jpeg|gif|webp|avif|ttf|woff|woff2|eot)$":
            "<rootDir>/src/test/fileMock.ts",
        // bare path aliases - keep in sync with tsconfig.app.json "paths"
        "^api/(.*)$": "<rootDir>/src/api/$1",
        "^assets/(.*)$": "<rootDir>/src/assets/$1",
        "^components/(.*)$": "<rootDir>/src/components/$1",
        "^config/(.*)$": "<rootDir>/src/config/$1",
        "^constants/(.*)$": "<rootDir>/src/constants/$1",
        "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
        "^i18n/(.*)$": "<rootDir>/src/i18n/$1",
        "^pages/(.*)$": "<rootDir>/src/pages/$1",
        "^test/(.*)$": "<rootDir>/src/test/$1",
        "^types/(.*)$": "<rootDir>/src/types/$1",
        "^utils/(.*)$": "<rootDir>/src/utils/$1",
    },
    transform: {
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
    },
    transformIgnorePatterns: ["/node_modules/(?!(axios|jwt-decode)/)"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/__tests__/**",
        "!src/test/**",
        "!src/main.tsx",
        "!src/vite-env.d.ts",
    ],
    coverageProvider: "v8",
};
