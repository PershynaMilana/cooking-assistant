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
            "sonarjs/cognitive-complexity": "error",
            "sonarjs/no-duplicate-string": "error",
        },
    },
];
