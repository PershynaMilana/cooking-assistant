import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// dev-proxy target is overridable via env; defaults to the local backend port
const proxyTarget =
    process.env.VITE_DEV_PROXY_TARGET ?? "http://localhost:3000";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
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
});
