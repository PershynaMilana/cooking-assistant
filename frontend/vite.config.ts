import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// dev-proxy target is overridable via env; defaults to the local backend port
const proxyTarget =
    process.env.VITE_DEV_PROXY_TARGET ?? "http://localhost:3000";

const srcDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "src",
);
const nodeModulesDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "node_modules",
);

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [react(), tsconfigPaths()],
    // strip console/debugger from the production build only; dev keeps them
    esbuild: command === "build" ? { drop: ["console", "debugger"] } : {},
    css: {
        // lets SCSS modules `@use "styles/..."` the same way TS uses the bare alias
        preprocessorOptions: {
            scss: {
                includePaths: [srcDir, nodeModulesDir],
            },
        },
    },
    server: {
        port: 8080,
        // same-origin in dev: the browser sees /api on :8080 and Vite forwards it
        // to the backend, so the auth cookie is first-party without TLS
        proxy: {
            "/api": {
                target: proxyTarget,
                changeOrigin: true,
            },
        },
    },
}));
