const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const promise = require("eslint-plugin-promise");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-config-prettier");

module.exports = [
    { ignores: ["node_modules", "coverage"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    promise.configs["flat/recommended"],
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
            eqeqeq: ["error", "always"],
            "no-var": "error",
            "prefer-const": "error",
            curly: ["error", "all"],
            "no-throw-literal": "error",
        },
    },
    {
        files: ["**/*.test.ts"],
        ...jest.configs["flat/recommended"],
    },
    {
        files: ["eslint.config.js", "eslint.sonarjs.config.js"],
        languageOptions: {
            globals: {
                require: "readonly",
                module: "readonly",
            },
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
    {
        files: ["jest.setup.ts"],
        rules: {
            "@typescript-eslint/no-namespace": "off",
        },
    },
    {
        files: ["middleware/asyncHandler.ts"],
        rules: {
            // Express uses next as the async rejection callback here.
            "promise/no-callback-in-promise": "off",
        },
    },
    prettier,
];
