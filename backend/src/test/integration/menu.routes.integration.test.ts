import request from "supertest";

import { buildTestApp, authCookie } from "../helpers/testApp";

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
            .set("Cookie", authCookie());

        expect(res.status).toBe(200);
        expect(res.body).toEqual(menus);
    });

    it("should create a menu, including public recipes of other users", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeRepository.findExistingIds.mockResolvedValue([3, 5]);
        deps.menuRepository.create.mockResolvedValue(9);

        const res = await request(app)
            .post("/api/create-menu")
            .set("Cookie", authCookie(7))
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
        expect(deps.recipeRepository.findExistingIds).toHaveBeenCalledWith([
            3, 5,
        ]);
    });

    it("should return 400 when creating a menu with a recipe that does not exist", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeRepository.findExistingIds.mockResolvedValue([3]);

        const res = await request(app)
            .post("/api/create-menu")
            .set("Cookie", authCookie(7))
            .send(makeMenuBody());

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: "One or more recipes do not exist",
        });
        expect(deps.menuRepository.create).not.toHaveBeenCalled();
    });

    it("should return menu details scoped to the authenticated user", async () => {
        const { app, deps } = buildTestApp();
        const menu = { menu: { id: 9, isOwner: true }, recipes: [] };
        deps.menuRepository.findByIdWithRecipes.mockResolvedValue(menu);

        const res = await request(app)
            .get("/api/menu/9")
            .set("Cookie", authCookie(7));

        expect(res.status).toBe(200);
        expect(res.body).toEqual(menu);
        expect(res.body.menu.isOwner).toBe(true);
        expect(deps.menuRepository.findByIdWithRecipes).toHaveBeenCalledWith(
            9,
            7,
        );
    });

    it("should return menu details with isOwner:false when reading a menu of another user", async () => {
        const { app, deps } = buildTestApp();
        const menu = { menu: { id: 9, isOwner: false }, recipes: [] };
        deps.menuRepository.findByIdWithRecipes.mockResolvedValue(menu);

        const res = await request(app)
            .get("/api/menu/9")
            .set("Cookie", authCookie(7));

        expect(res.status).toBe(200);
        expect(res.body.menu.isOwner).toBe(false);
        expect(deps.menuRepository.findByIdWithRecipes).toHaveBeenCalledWith(
            9,
            7,
        );
    });

    it("should update a menu owned by the authenticated user", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeRepository.findExistingIds.mockResolvedValue([3, 5]);
        deps.menuRepository.update.mockResolvedValue(true);

        const res = await request(app)
            .put("/api/menu/9")
            .set("Cookie", authCookie(7))
            .send(makeMenuBody());

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Menu updated successfully" });
        expect(deps.menuRepository.update.mock.calls[0][0]).toBe(9);
        expect(deps.menuRepository.update.mock.calls[0][1]).toBe(7);
    });

    it("should return 404 when updating a menu of another user", async () => {
        const { app, deps } = buildTestApp();
        deps.recipeRepository.findExistingIds.mockResolvedValue([3, 5]);
        deps.menuRepository.update.mockResolvedValue(false);

        const res = await request(app)
            .put("/api/menu/9")
            .set("Cookie", authCookie(7))
            .send(makeMenuBody());

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Menu not found" });
    });

    it("should delete a menu owned by the authenticated user", async () => {
        const { app, deps } = buildTestApp();
        deps.menuRepository.deleteById.mockResolvedValue(true);

        const res = await request(app)
            .delete("/api/menu/9")
            .set("Cookie", authCookie(7));

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Menu deleted successfully" });
        expect(deps.menuRepository.deleteById).toHaveBeenCalledWith(9, 7);
    });

    it("should search person menus by the authenticated user", async () => {
        const { app, deps } = buildTestApp();
        const menus = [{ id: 9, title: "Weekly menu" }];
        deps.menuRepository.searchByPerson.mockResolvedValue(menus);

        const res = await request(app)
            .get("/api/menu-filters-person?menu_name=Weekly")
            .set("Cookie", authCookie(7));

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
            .set("Cookie", authCookie());

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Menu not found" });
    });
});
