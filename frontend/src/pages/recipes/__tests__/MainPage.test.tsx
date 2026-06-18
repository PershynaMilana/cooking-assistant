import { screen } from "@testing-library/react";

import { getRecipesByFilters } from "api/recipesApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import MainPage from "pages/recipes/MainPage";
import { renderWithRouter } from "test/router";

jest.mock("../../../api/recipesApi");
jest.mock("../../../api/recipeTypesApi");

const RECIPE_TITLE_1 = "Borscht";
const RECIPE_TITLE_2 = "Varenyky";

const SAMPLE_RECIPES = [
    {
        id: 1,
        title: RECIPE_TITLE_1,
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 60,
    },
    {
        id: 2,
        title: RECIPE_TITLE_2,
        type_name: "Main",
        creation_date: "2024-01-02",
        cooking_time: 45,
    },
];

describe("MainPage", () => {
    it("should render recipe titles returned by the api", async () => {
        jest.mocked(getRecipesByFilters).mockResolvedValue(SAMPLE_RECIPES);
        jest.mocked(getRecipeTypes).mockResolvedValue([]);

        renderWithRouter(<MainPage />, ["/main"]);

        expect(await screen.findByText(RECIPE_TITLE_1)).toBeInTheDocument();
        expect(screen.getByText(RECIPE_TITLE_2)).toBeInTheDocument();
    });
});
