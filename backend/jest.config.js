const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
    preset: "ts-jest",
    rootDir: ".",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts", "**/integration/**/*.test.ts"],
    testEnvironment: "node",
    clearMocks: true,
    restoreMocks: true,
    setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/",
    }),
    collectCoverageFrom: [
        "src/application/use-cases/**/*.ts",
        "src/domain/entities/**/*.ts",
        "src/domain/errors/**/*.ts",
        "src/middleware/**/*.ts",
        "src/controller/**/*.ts",
        "src/routes/**/*.ts",
        "src/app.ts",
        "!**/__tests__/**",
        "!**/*.types.ts",
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageProvider: "v8",
    coverageThreshold: {
        global: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
};
