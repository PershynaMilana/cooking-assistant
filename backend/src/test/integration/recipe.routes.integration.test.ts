import request from "supertest";

import { buildTestApp, authHeader } from "../helpers/testApp";

function makeRecipeBody() {
    return {
        title: "Tomato soup",
        content: "Boil tomatoes",
        ingredients: [{ id: 3, quantity: 2, quantity_recipe_ingredients: 2 }],
        type_id: 1,
        cooking_time: 30,
        servings: 4,
    };
}

describe("recipe routes", () => {
    it("should return 401 without a token", async () => {
        const { app } = buildTestApp();

        const res = await request(app).get("/api/recipes");

        expect(res.status).toBe(401);
    });

    it("should create a recipe for an authenticated request", async () => {
        const { app, deps } = buildTestApp();
        const createdRecipe = { id: 12, title: "Tomato soup" };
        deps.recipeRepository.create.mockResolvedValue(createdRecipe);

        const res = await request(app)
            .post("/api/recipe")
            .set("Authorization", authHeader(7))
            .send(makeRecipeBody());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(createdRecipe);
        expect(deps.recipeRepository.create.mock.calls[0][0]).toMatchObject({
            title: "Tomato soup",
            person_id: 7,
        });
    });

    it("should return recipes for an authenticated request", async () => {
        const { app, deps } = buildTestApp();
        const recipes = [{ id: 12, title: "Tomato soup" }];
        deps.recipeRepository.findAllWithIngredients.mockResolvedValue(recipes);

        const res = await request(app)
            .get("/api/recipes")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(recipes);
    });

    it("should return one recipe with ingredients", async () => {
        const { app, deps } = buildTestApp();
        const recipe = { id: 12, title: "Tomato soup", ingredients: [] };
        deps.recipeRepository.findByIdWithIngredients.mockResolvedValue(recipe);

        const res = await request(app)
            .get("/api/recipe/12")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(recipe);
    });

    it("should return all known ingredients", async () => {
        const { app, deps } = buildTestApp();
        const ingredients = [{ id: 3, name: "tomato" }];
        deps.recipeRepository.findAllIngredients.mockResolvedValue(ingredients);

        const res = await request(app)
            .get("/api/ingredients")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(ingredients);
    });

    it("should update a recipe", async () => {
        const { app, deps } = buildTestApp();
        const updatedRecipe = { id: 12, title: "Tomato soup" };
        deps.recipeRepository.update.mockResolvedValue(updatedRecipe);

        const res = await request(app)
            .put("/api/recipe/12")
            .set("Authorization", authHeader())
            .send(makeRecipeBody());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedRecipe);
    });

    it("should delete a recipe", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeRepository.deleteById.mockResolvedValue(true);

        const res = await request(app)
            .delete("/api/recipe/12")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Recipe successfully deleted" });
    });

    it("should search recipes by filters", async () => {
        const { app, deps } = buildTestApp();
        const recipes = [{ id: 12, title: "Tomato soup" }];
        deps.recipeRepository.search.mockResolvedValue(recipes);

        const res = await request(app)
            .get("/api/recipes-by-filters?ingredient_name=tomato")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(recipes);
    });

    it("should search person recipes by the authenticated user", async () => {
        const { app, deps } = buildTestApp();
        const recipes = [{ id: 12, title: "Tomato soup" }];
        deps.recipeRepository.searchByPerson.mockResolvedValue(recipes);

        const res = await request(app)
            .get("/api/recipes-filters-person/999?ingredient_name=tomato")
            .set("Authorization", authHeader(7));

        expect(res.status).toBe(200);
        expect(res.body).toEqual(recipes);
        expect(deps.recipeRepository.searchByPerson).toHaveBeenCalledWith(7, {
            ingredient_name: "tomato",
        });
    });

    it("should return recipe stats", async () => {
        const { app, deps } = buildTestApp();
        const stats = { fastestRecipe: [{ id: 12 }] };
        deps.recipeRepository.getStats.mockResolvedValue(stats);

        const res = await request(app)
            .get("/api/recipes-stats")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(stats);
    });

    it("should map a not found recipe to an error response", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeRepository.findByIdWithIngredients.mockResolvedValue(null);

        const res = await request(app)
            .get("/api/recipe/99")
            .set("Authorization", authHeader());

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Recipe not found" });
    });
});
