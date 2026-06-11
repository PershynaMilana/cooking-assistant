import express, { type Router } from "express";

export default function createHealthRouter(): Router {
    const router = express.Router();

    // liveness probe, no auth
    router.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    return router;
}
