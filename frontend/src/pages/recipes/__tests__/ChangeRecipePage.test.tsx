import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ChangeRecipePage from "../ChangeRecipePage";
import { getRecipeById } from "../../../api/recipesApi";
import { getIngredients } from "../../../api/ingredientsApi";
import { getRecipeTypes } from "../../../api/recipeTypesApi";
import type { RecipeDetails } from "../../../types/recipe";

jest.mock("../../../api/recipesApi");
jest.mock("../../../api/ingredientsApi");
jest.mock("../../../api/recipeTypesApi");

const TITLE = "Borscht";
const SAMPLE: RecipeDetails = {
    id: 1,
    title: TITLE,
    content: "boil",
    ingredients: [],
    type_id: 2,
    type_name: "Soup",
    cooking_time: 60,
    creation_date: "2024-01-01",
    servings: "4",
    person_id: 3,
};

describe("ChangeRecipePage", () => {
    it("should load the recipe into the edit form", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(SAMPLE);
        jest.mocked(getIngredients).mockResolvedValue([]);
        jest.mocked(getRecipeTypes).mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={["/change-recipe/1"]}>
                <Routes>
                    <Route
                        path="/change-recipe/:id"
                        element={<ChangeRecipePage />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByDisplayValue(TITLE)).toBeInTheDocument();
    });
});
