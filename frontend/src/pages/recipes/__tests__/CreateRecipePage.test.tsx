import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { getIngredients } from "api/ingredientsApi";
import { createRecipe } from "api/recipesApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import CreateRecipePage from "pages/recipes/CreateRecipePage";
import { mockJwtUser, setAuthToken } from "test/auth";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("../../../api/recipesApi");
jest.mock("../../../api/recipeTypesApi");
jest.mock("../../../api/ingredientsApi");
jest.mock("jwt-decode");

const PERSON_ID = 7;
const TYPE_ID = 3;
const TYPE_NAME = "Soup";
const INGREDIENT_ID = 11;
const INGREDIENT_NAME = "Potato";
const TITLE = "Mashed potatoes";
const DESCRIPTION = "Boil and mash";
const SERVINGS = "2";

const SAMPLE_TYPES = [{ id: TYPE_ID, type_name: TYPE_NAME, description: "" }];
const SAMPLE_INGREDIENTS = [
    { id: INGREDIENT_ID, name: INGREDIENT_NAME, unit_name: "g" },
];

describe("CreateRecipePage", () => {
    it("should create the recipe and navigate home on submit", async () => {
        setAuthToken();
        mockJwtUser(PERSON_ID);
        jest.mocked(getRecipeTypes).mockResolvedValue(SAMPLE_TYPES);
        jest.mocked(getIngredients).mockResolvedValue(SAMPLE_INGREDIENTS);
        const mockedCreateRecipe = jest.mocked(createRecipe);

        mockedCreateRecipe.mockResolvedValue(undefined);

        renderWithRouter(<CreateRecipePage />);

        const ingredientButton = await screen.findByRole("button", {
            name: INGREDIENT_NAME,
        });

        await screen.findByRole("option", { name: TYPE_NAME });

        await userEvent.type(screen.getByLabelText("Title"), TITLE);
        await userEvent.type(screen.getByLabelText("Description"), DESCRIPTION);
        await userEvent.type(
            screen.getByLabelText("Cooking Time (hh:mm)"),
            "0:30",
        );
        await userEvent.type(
            screen.getByLabelText(
                "Servings (for which container is the recipe calculated):",
            ),
            SERVINGS,
        );
        await userEvent.selectOptions(
            screen.getByLabelText("Recipe Type"),
            String(TYPE_ID),
        );
        await userEvent.click(ingredientButton);
        await userEvent.click(
            screen.getByRole("button", { name: "Create Recipe" }),
        );

        expect(mockedCreateRecipe).toHaveBeenCalledWith(
            expect.objectContaining({
                title: TITLE,
                content: DESCRIPTION,
                person_id: PERSON_ID,
                type_id: TYPE_ID,
                servings: SERVINGS,
                ingredients: [{ id: INGREDIENT_ID, quantity: 1 }],
            }),
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
