import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";

export default [
    { ignores: ["dist", "eslint.config.js", "eslint.sonarjs.config.js"] },
    sonarjs.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
        },
        rules: {
            // TODO R23: enable as error after components are split
            "sonarjs/cognitive-complexity": "warn",
            "sonarjs/no-duplicate-string": "warn",
        },
    },
];
