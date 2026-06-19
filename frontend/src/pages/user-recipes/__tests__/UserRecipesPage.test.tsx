import { screen } from "@testing-library/react";

import type { RecipeListItem } from "types/recipe";

import { getRecipesByPerson } from "api/recipesApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import UserRecipesPage from "pages/user-recipes/UserRecipesPage";
import { mockJwtUser, setAuthToken } from "test/auth";
import { renderWithRouter } from "test/router";

jest.mock("api/recipesApi");
jest.mock("api/recipeTypesApi");
jest.mock("jwt-decode");

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

describe("UserRecipesPage", () => {
    it("should render the user's recipes loaded from the api", async () => {
        setAuthToken();
        mockJwtUser();
        jest.mocked(getRecipesByPerson).mockResolvedValue(SAMPLE);
        jest.mocked(getRecipeTypes).mockResolvedValue([]);

        renderWithRouter(<UserRecipesPage />, ["/my-recipes"]);

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });
});
