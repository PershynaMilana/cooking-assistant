const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    { ignores: ["node_modules"] },
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: { ...globals.node },
        },
        rules: {
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
    },
    {
        files: ["**/*.test.js", "jest.setup.js"],
        languageOptions: { globals: { ...globals.jest } },
    },
];
