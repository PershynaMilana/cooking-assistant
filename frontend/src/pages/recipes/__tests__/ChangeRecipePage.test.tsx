import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RecipeDetails } from "types/recipe";

import { getIngredients } from "api/ingredientsApi";
import { getRecipeById, updateRecipe } from "api/recipesApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import ChangeRecipePage from "pages/recipes/ChangeRecipePage";
import {
    ERROR_COOKING_TIME_FORMAT,
    LABEL_COOKING_TIME,
    MOCK_ERROR_SERVER,
    ROUTE_HOME,
} from "test/constants";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipesApi");
jest.mock("api/ingredientsApi");
jest.mock("api/recipeTypesApi");

const TITLE = "Borscht";
const UPDATE_RECIPE = "Update Recipe";
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

const setup = () => {
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
};

describe("ChangeRecipePage", () => {
    it("should load the recipe into the edit form", async () => {
        setup();

        expect(await screen.findByDisplayValue(TITLE)).toBeInTheDocument();
    });

    it("should show a cooking-time error when submitting with invalid time", async () => {
        setup();

        await screen.findByDisplayValue(TITLE);

        const cookingTimeInput = screen.getByLabelText(LABEL_COOKING_TIME);

        await userEvent.clear(cookingTimeInput);
        await userEvent.type(cookingTimeInput, "invalid");
        await userEvent.click(
            screen.getByRole("button", { name: UPDATE_RECIPE }),
        );

        expect(screen.getByText(ERROR_COOKING_TIME_FORMAT)).toBeInTheDocument();
    });

    it("should call updateRecipe with the changed values on valid submit", async () => {
        jest.mocked(updateRecipe).mockResolvedValue(undefined);
        setup();

        await screen.findByDisplayValue(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: UPDATE_RECIPE }),
        );

        expect(jest.mocked(updateRecipe)).toHaveBeenCalledWith(
            "1",
            expect.objectContaining({
                title: TITLE,
                cooking_time: 60,
            }),
        );
    });

    it("should navigate home after successful update", async () => {
        jest.mocked(updateRecipe).mockResolvedValue(undefined);
        setup();

        await screen.findByDisplayValue(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: UPDATE_RECIPE }),
        );

        expect(mockNavigate).toHaveBeenCalledWith(ROUTE_HOME);
    });

    it("should display an error message when updateRecipe fails", async () => {
        jest.mocked(updateRecipe).mockRejectedValue(new Error("Server error"));
        setup();

        await screen.findByDisplayValue(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: UPDATE_RECIPE }),
        );

        expect(await screen.findByText(MOCK_ERROR_SERVER)).toBeInTheDocument();
    });
});
