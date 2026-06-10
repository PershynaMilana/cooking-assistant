const js = require("@eslint/js");
const globals = require("globals");
const n = require("eslint-plugin-n").default;
const promise = require("eslint-plugin-promise");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-config-prettier");

module.exports = [
    { ignores: ["node_modules", "coverage"] },
    js.configs.recommended,
    n.configs["flat/recommended-script"],
    promise.configs["flat/recommended"],
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: { ...globals.node },
        },
        rules: {
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            eqeqeq: ["error", "always"],
            "no-var": "error",
            "prefer-const": "error",
            curly: ["error", "all"],
            "no-throw-literal": "error",
        },
    },
    {
        files: ["**/*.test.js"],
        ...jest.configs["flat/recommended"],
    },
    {
        files: ["jest.setup.js"],
        languageOptions: { globals: { ...globals.jest } },
    },
    {
        files: ["eslint.config.js", "eslint.sonarjs.config.js"],
        rules: {
            // The ESLint config intentionally loads dev-only tooling in this private app.
            "n/no-unpublished-require": "off",
        },
    },
    {
        files: ["middleware/asyncHandler.js"],
        rules: {
            // Express uses next as the async rejection callback here.
            "promise/no-callback-in-promise": "off",
        },
    },
    prettier,
];
