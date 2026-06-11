import request from "supertest";

import { buildTestApp, authHeader } from "../helpers/testApp";

function makeMenuBody() {
    return {
        menuTitle: "Weekly menu",
        menuContent: "Simple dinners",
        categoryId: 2,
        recipeIds: [3, 5],
    };
}

describe("menu routes", () => {
    it("should return 401 without a token", async () => {
        const { app } = buildTestApp();

        const res = await request(app).get("/api/menu");

        expect(res.status).toBe(401);
    });

    it("should return menus", async () => {
        const { app, deps } = buildTestApp();
        const menus = [{ id: 9, title: "Weekly menu" }];
        deps.menuRepository.findAll.mockResolvedValue(menus);

        const res = await request(app)
            .get("/api/menu?menu_name=Weekly")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(menus);
    });

    it("should create a menu", async () => {
        const { app, deps } = buildTestApp();
        deps.menuRepository.create.mockResolvedValue(9);

        const res = await request(app)
            .post("/api/create-menu")
            .set("Authorization", authHeader(7))
            .send(makeMenuBody());

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            message: "Menu created successfully",
            menuId: 9,
        });
        expect(deps.menuRepository.create.mock.calls[0][0]).toMatchObject({
            menuTitle: "Weekly menu",
            personId: 7,
        });
    });

    it("should return menu details", async () => {
        const { app, deps } = buildTestApp();
        const menu = { menu: { id: 9 }, recipes: [] };
        deps.menuRepository.findByIdWithRecipes.mockResolvedValue(menu);

        const res = await request(app)
            .get("/api/menu/9")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(menu);
    });

    it("should update a menu", async () => {
        const { app, deps } = buildTestApp();
        deps.menuRepository.update.mockResolvedValue(undefined);

        const res = await request(app)
            .put("/api/menu/9")
            .set("Authorization", authHeader())
            .send(makeMenuBody());

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Menu updated successfully" });
    });

    it("should delete a menu", async () => {
        const { app, deps } = buildTestApp();
        deps.menuRepository.deleteById.mockResolvedValue(true);

        const res = await request(app)
            .delete("/api/menu/9")
            .set("Authorization", authHeader());

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Menu deleted successfully" });
    });

    it("should search person menus by the authenticated user", async () => {
        const { app, deps } = buildTestApp();
        const menus = [{ id: 9, title: "Weekly menu" }];
        deps.menuRepository.searchByPerson.mockResolvedValue(menus);

        const res = await request(app)
            .get("/api/menu-filters-person/999?menu_name=Weekly")
            .set("Authorization", authHeader(7));

        expect(res.status).toBe(200);
        expect(res.body).toEqual(menus);
        expect(deps.menuRepository.searchByPerson).toHaveBeenCalledWith(7, {
            menu_name: "Weekly",
        });
    });

    it("should map a missing menu to an error response", async () => {
        const { app, deps } = buildTestApp();
        deps.menuRepository.findByIdWithRecipes.mockResolvedValue(null);

        const res = await request(app)
            .get("/api/menu/99")
            .set("Authorization", authHeader());

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Menu not found" });
    });
});
