import jwt from "jsonwebtoken";

import { createApp } from "../../app";
import { buildControllers } from "../../composition-root";
import { buildFakeDeps } from "./fakeRepositories";

export function buildTestApp() {
    const deps = buildFakeDeps();
    const app = createApp(buildControllers(deps));

    return { app, deps };
}

export function authHeader(userId = 1): string {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY as string,
    );

    return `Bearer ${token}`;
}
