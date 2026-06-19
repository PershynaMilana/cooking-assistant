// lint-staged.config.js (CommonJS — root package.json has no "type":"module")
//
// ESLint v9 resolves flat-config (eslint.config.js) by walking up from each
// file being linted, so we only need its cwd set to frontend/. We use
// `node -e` with execSync({cwd}) instead of `cd dir && cmd` because the
// shell `&&` pattern is unreliable on Windows (Git Bash / husky context).
const path = require("path");

const frontendDir = path.join(__dirname, "frontend");
// Forward-slash form used inside the node -e string literal (safe on Windows too).
const frontendFwd = frontendDir.replace(/\\/g, "/");

module.exports = {
    // backend: prettier-only (eslint autofix for backend = B1 scope)
    "backend/**/*.ts": ["prettier --write"],

    // frontend TS/TSX: eslint --fix first (from frontend/ so flat-config is found),
    // then prettier
    "frontend/**/*.{ts,tsx}": (files) => {
        const relPaths = files
            .map((f) => path.relative(frontendDir, f).replace(/\\/g, "/").trim())
            .join(" ");
        // Function form does not auto-append files; pass them explicitly to both commands.
        const absPaths = files.map((f) => `"${f.replace(/\\/g, "/")}"`).join(" ");

        return [
            `node -e "require('child_process').execSync('npx eslint --fix ${relPaths}',{stdio:'inherit',cwd:'${frontendFwd}',shell:true})"`,
            `prettier --write ${absPaths}`,
        ];
    },

    // frontend CSS/SCSS: stylelint then prettier (unchanged behaviour)
    "frontend/**/*.{css,scss}": [
        "./frontend/node_modules/.bin/stylelint --fix",
        "prettier --write",
    ],
};
