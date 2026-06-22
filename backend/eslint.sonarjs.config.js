const tseslint = require("typescript-eslint");
const sonarjs = require("eslint-plugin-sonarjs");

module.exports = [
    { ignores: ["node_modules", "coverage", "dist"] },
    sonarjs.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
        },
    },
];
