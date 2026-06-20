import { screen } from "@testing-library/react";

import type { RecipeTypeSummary } from "types/recipeType";

import { getRecipeTypes } from "api/recipeTypesApi";

import TypesPage from "pages/recipe-types/TypesPage";
import { renderWithRouter } from "test/router";

jest.mock("api/recipeTypesApi");

const TYPE_NAME = "Soup";
const SAMPLE: RecipeTypeSummary[] = [
    { id: 1, type_name: TYPE_NAME, description: "warm" },
];

describe("TypesPage", () => {
    it("should render the recipe types loaded from the api", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(SAMPLE);

        renderWithRouter(<TypesPage />);

        expect(await screen.findByText(TYPE_NAME)).toBeInTheDocument();
    });

    it("should not offer add, edit or delete controls", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(SAMPLE);

        renderWithRouter(<TypesPage />);

        await screen.findByText(TYPE_NAME);

        expect(
            screen.queryByRole("button", { name: /add|edit|delete/i }),
        ).not.toBeInTheDocument();
    });
});
