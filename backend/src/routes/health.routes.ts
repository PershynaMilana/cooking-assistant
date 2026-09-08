import express, { type Router } from "express";

import { ROUTES } from "constants/routes";

export default function createHealthRouter(): Router {
    const router = express.Router();

    // liveness probe, no auth
    router.get(ROUTES.health, (_req, res) => {
        res.json({ status: "ok" });
    });

    return router;
}
