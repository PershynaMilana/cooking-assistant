const globals = require("globals");
const sonarjs = require("eslint-plugin-sonarjs");

module.exports = [
    { ignores: ["node_modules", "coverage"] },
    sonarjs.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: { ...globals.node },
        },
    },
    {
        files: ["**/*.test.js", "jest.setup.js"],
        languageOptions: { globals: { ...globals.jest } },
    },
];
