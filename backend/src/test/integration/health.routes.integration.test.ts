import request from "supertest";

import { buildTestApp } from "test/helpers/testApp";

describe("health routes", () => {
    it("should return ok without a token", async () => {
        const { app } = buildTestApp();

        const res = await request(app).get("/api/health");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });
});
