import { screen } from "@testing-library/react";

import type { Ingredient } from "types/ingredient";
import type { UserIngredient } from "types/userIngredient";

import { getIngredients } from "api/ingredientsApi";
import { getUserIngredients } from "api/userIngredientsApi";

import IngredientsPage from "pages/person-ingradients/IngredientsPage";
import { mockJwtUser, setAuthToken } from "test/auth";
import { renderWithRouter } from "test/router";

jest.mock("../../../api/ingredientsApi");
jest.mock("../../../api/userIngredientsApi");
jest.mock("jwt-decode");

const INGREDIENT_NAME = "Potato";
const USER_INGREDIENTS: UserIngredient[] = [
    {
        ingredient_id: 5,
        ingredient_name: INGREDIENT_NAME,
        unit_name: "g",
        quantity_person_ingradient: 100,
    },
];
const ALL_INGREDIENTS: Ingredient[] = [
    { id: 5, name: INGREDIENT_NAME, unit_name: "g" },
];

describe("IngredientsPage", () => {
    it("should render the user's pantry ingredients loaded from the api", async () => {
        setAuthToken();
        mockJwtUser();
        jest.mocked(getIngredients).mockResolvedValue(ALL_INGREDIENTS);
        jest.mocked(getUserIngredients).mockResolvedValue(USER_INGREDIENTS);

        renderWithRouter(<IngredientsPage />);

        expect(await screen.findByText(INGREDIENT_NAME)).toBeInTheDocument();
    });
});
