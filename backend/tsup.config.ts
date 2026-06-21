import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        // main app entry
        index: "src/index.ts",
        // keep scripts/ subdir so __dirname in migrate.ts resolves ../../migrations correctly
        "scripts/migrate": "src/scripts/migrate.ts",
        "scripts/seed": "src/scripts/seed.ts",
    },
    format: ["cjs"],
    target: "node20",
    platform: "node",
    bundle: true,
    sourcemap: false,
    clean: true,
    tsconfig: "tsconfig.json",
});
