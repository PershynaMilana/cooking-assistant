import {
    changeMenuPath,
    changeRecipePath,
    editRecipeTypePath,
    menuDetailsPath,
    recipeDetailsPath,
    ROUTES,
} from "constants/routes";

describe("route path builders", () => {
    it("should build a recipe details path from a numeric id", () => {
        expect(recipeDetailsPath(7)).toBe("/recipe/7");
    });

    it("should build a change recipe path from a string id", () => {
        expect(changeRecipePath("42")).toBe("/change-recipe/42");
    });

    it("should build an edit recipe type path", () => {
        expect(editRecipeTypePath(3)).toBe("/types/3");
    });

    it("should build a menu details path", () => {
        expect(menuDetailsPath(9)).toBe("/menu/9");
    });

    it("should build a change menu path", () => {
        expect(changeMenuPath(9)).toBe("/change-menu/9");
    });

    it("should keep the param pattern on the route constant", () => {
        expect(ROUTES.recipeDetails).toBe("/recipe/:id");
    });
});
