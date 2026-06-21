import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RecipeListItem } from "types/recipe";
import type { RecipeTypeSummary } from "types/recipeType";

import { getRecipesByPerson } from "api/recipesApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import UserRecipesPage from "pages/user-recipes/UserRecipesPage";
import { renderWithRouter } from "test/router";

jest.mock("api/recipesApi");
jest.mock("api/recipeTypesApi");

const TITLE = "Borscht";
const SAMPLE: RecipeListItem[] = [
    {
        id: 1,
        title: TITLE,
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 60,
    },
];

const SOUP_TYPE: RecipeTypeSummary = {
    id: 1,
    type_name: "Soup",
    description: "Warm dishes",
};

describe("UserRecipesPage", () => {
    it("should render the user's recipes loaded from the api", async () => {
        jest.mocked(getRecipesByPerson).mockResolvedValue(SAMPLE);
        jest.mocked(getRecipeTypes).mockResolvedValue([]);

        renderWithRouter(<UserRecipesPage />, ["/my-recipes"]);

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });

    it("should show the by-type heading and empty message when a type is selected", async () => {
        jest.mocked(getRecipesByPerson).mockResolvedValue([]);
        jest.mocked(getRecipeTypes).mockResolvedValue([SOUP_TYPE]);

        renderWithRouter(<UserRecipesPage />, ["/my-recipes"]);

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(screen.getByRole("checkbox"));

        expect(await screen.findByText("Recipes: Soup")).toBeInTheDocument();
        expect(
            screen.getByText("No recipes of this type found."),
        ).toBeInTheDocument();
    });
});
