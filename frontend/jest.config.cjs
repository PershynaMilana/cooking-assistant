/** @type {import("jest").Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
    setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(svg|png|jpg|jpeg|gif|webp|avif|ttf|woff|woff2|eot)$":
            "<rootDir>/src/test/fileMock.ts",
    },
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
            "ts-jest",
            { tsconfig: "<rootDir>/tsconfig.spec.json" },
        ],
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
