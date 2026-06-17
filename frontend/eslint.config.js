import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist", "coverage"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.strict],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    },
    jsxA11y.flatConfigs.recommended,
    // TODO R23 - включить ПОСЛЕ рефактора R10-R15 (когда файлы разбиты под лимиты).
    // Раскомментировать для энфорса размера файлов/сложности; пороги подкрутить на R23.
    // Размер файла - встроенные ESLint-правила. "Условие 3+ операндов → именованная const"
    // и rule-of-three остаются ревью/промт-конвенцией (CONTEXT/CLAUDE.md), не линтом.
    // {
    //   files: ["**/*.{ts,tsx}"],
    //   rules: {
    //     "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
    //     "max-lines-per-function": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
    //     complexity: ["error", 15],
    //   },
    // },
    // {
    //   files: ["src/pages/**/*.{ts,tsx}"], // страницы тоньше (только композиция)
    //   rules: {
    //     "max-lines": ["error", { max: 120, skipBlankLines: true, skipComments: true }],
    //   },
    // },
    // TODO R23 - кастомное правило "условие 3+ операндов → именованная const" (включить вместе с лимитами).
    // Скоуп: тесты if / ternary / while / for. Дотюнить при включении (исключения - eslint-disable).
    // {
    //   files: ["src/**/*.{ts,tsx}"],
    //   plugins: {
    //     local: {
    //       rules: {
    //         "no-complex-condition": {
    //           meta: {
    //             type: "suggestion",
    //             messages: { complex: "Условие из 3+ операндов: вынеси в именованную константу." },
    //           },
    //           create(context) {
    //             const count = (n) =>
    //               n && n.type === "LogicalExpression" ? count(n.left) + count(n.right) : 1;
    //             const check = (t) => {
    //               if (t && t.type === "LogicalExpression" && count(t) >= 3)
    //                 context.report({ node: t, messageId: "complex" });
    //             };
    //             return {
    //               IfStatement: (n) => check(n.test),
    //               ConditionalExpression: (n) => check(n.test),
    //               WhileStatement: (n) => check(n.test),
    //               DoWhileStatement: (n) => check(n.test),
    //               ForStatement: (n) => check(n.test),
    //             };
    //           },
    //         },
    //       },
    //     },
    //   },
    //   rules: { "local/no-complex-condition": "error" },
    // },
    prettier,
);
