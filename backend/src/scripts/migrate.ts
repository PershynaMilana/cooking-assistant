import path from "path";

import { runner } from "node-pg-migrate";

import { config } from "@config/env";
import { logger } from "@config/logger";

type MigrationDirection = "up" | "down";

const migrationsDir = path.resolve(__dirname, "../../migrations");

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const direction: MigrationDirection = args.includes("down") ? "down" : "up";
    const fake = args.includes("--fake");

    const migrations = await runner({
        databaseUrl: config.db,
        dir: migrationsDir,
        migrationsTable: "pgmigrations",
        direction,
        count: direction === "down" ? 1 : Infinity,
        fake,
    });

    const names = migrations.map((migration) => migration.name);
    logger.info(
        { direction, fake, migrations: names },
        names.length
            ? `Migrations ${direction} applied`
            : "No pending migrations",
    );
}

main().catch((error) => {
    logger.error(error);
    process.exitCode = 1;
});
