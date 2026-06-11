import request from "supertest";

import { buildTestApp, authHeader } from "../helpers/testApp";

describe("recipe type routes", () => {
    it("should return 401 without a token", async () => {
        const { app } = buildTestApp();

        const res = await request(app).get("/api/recipe-types");

        expect(res.status).toBe(401);
    });

    it("should return recipe types", async () => {
        const { app, deps } = buildTestApp();
        const types = [{ id: 1, type_name: "Soup" }];
        deps.recipeTypeRepository.findAll.mockResolvedValue(types);

        const res = await request(app)
            .get("/api/recipe-types")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(types);
    });

    it("should create a recipe type", async () => {
        const { app, deps } = buildTestApp();
        const type = { id: 1, type_name: "Soup", description: "Warm" };
        deps.recipeTypeRepository.create.mockResolvedValue(type);

        const res = await request(app)
            .post("/api/recipe-types")
            .set("Authorization", authHeader())
            .send({ type_name: "Soup", description: "Warm" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(type);
    });

    it("should update a recipe type", async () => {
        const { app, deps } = buildTestApp();
        const type = { id: 1, type_name: "Soup", description: "Hot" };
        deps.recipeTypeRepository.update.mockResolvedValue(type);

        const res = await request(app)
            .put("/api/recipe-type/1")
            .set("Authorization", authHeader())
            .send({ type_name: "Soup", description: "Hot" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(type);
    });

    it("should delete a recipe type", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeTypeRepository.deleteById.mockResolvedValue(true);

        const res = await request(app)
            .delete("/api/recipe-type/1")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: "Recipe type and all related recipes successfully deleted",
        });
    });

    it("should return one recipe type", async () => {
        const { app, deps } = buildTestApp();
        const type = { id: 1, type_name: "Soup" };
        deps.recipeTypeRepository.findById.mockResolvedValue(type);

        const res = await request(app)
            .get("/api/recipe-type/1")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(type);
    });

    it("should map a missing recipe type to an error response", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeTypeRepository.findById.mockResolvedValue(null);

        const res = await request(app)
            .get("/api/recipe-type/99")
            .set("Authorization", authHeader());

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Recipe type not found" });
    });
});
