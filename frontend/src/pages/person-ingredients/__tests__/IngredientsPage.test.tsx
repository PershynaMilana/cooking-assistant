import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Ingredient } from "types/ingredient";
import type { UserIngredient } from "types/userIngredient";

import { getIngredients } from "api/ingredientsApi";
import {
    deleteUserIngredient,
    getUserIngredients,
    saveUserIngredient,
    updateQuantities,
} from "api/userIngredientsApi";

import IngredientsPage from "pages/person-ingredients/IngredientsPage";
import { BTN_EDIT_INGREDIENTS } from "test/constants";
import { renderWithRouter } from "test/router";

jest.mock("api/ingredientsApi");
jest.mock("api/userIngredientsApi");

const INGREDIENT_NAME = "Potato";
const SAVE_QUANTITIES = "Save quantities";
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
    { id: 6, name: "Tomato", unit_name: "kg" },
];

const setup = () => {
    jest.mocked(getIngredients).mockResolvedValue(ALL_INGREDIENTS);
    jest.mocked(getUserIngredients).mockResolvedValue(USER_INGREDIENTS);

    renderWithRouter(<IngredientsPage />);
};

describe("IngredientsPage", () => {
    it("should render the user's pantry ingredients loaded from the api", async () => {
        setup();

        expect(await screen.findByText(INGREDIENT_NAME)).toBeInTheDocument();
    });

    it("should show the ingredient selector after clicking Edit ingredients", async () => {
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_EDIT_INGREDIENTS }),
        );

        expect(
            screen.getByRole("button", { name: "Tomato" }),
        ).toBeInTheDocument();
    });

    it("should hide the ingredient selector after clicking Save", async () => {
        jest.mocked(saveUserIngredient).mockResolvedValue(undefined);
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_EDIT_INGREDIENTS }),
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(
            screen.queryByRole("button", { name: "Tomato" }),
        ).not.toBeInTheDocument();
    });

    it("should show the delete confirmation modal when Delete is clicked", async () => {
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(
            screen.getByText(
                `Are you sure you want to delete the ingredient "${INGREDIENT_NAME}"?`,
            ),
        ).toBeInTheDocument();
    });

    it("should show the quantity editor after clicking Edit quantities", async () => {
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(
            screen.getByRole("button", { name: "Edit quantities" }),
        );

        expect(
            screen.getByRole("button", { name: SAVE_QUANTITIES }),
        ).toBeInTheDocument();
    });

    it("should hide the quantity editor after clicking Save quantities", async () => {
        jest.mocked(updateQuantities).mockResolvedValue(undefined);
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(
            screen.getByRole("button", { name: "Edit quantities" }),
        );
        await userEvent.click(
            screen.getByRole("button", { name: SAVE_QUANTITIES }),
        );

        expect(
            screen.queryByRole("button", { name: SAVE_QUANTITIES }),
        ).not.toBeInTheDocument();
    });

    it("should close the delete confirmation modal when Cancel is clicked", async () => {
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));
        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(
            screen.queryByText(
                `Are you sure you want to delete the ingredient "${INGREDIENT_NAME}"?`,
            ),
        ).not.toBeInTheDocument();
    });

    it("should remove ingredient from list after confirming delete", async () => {
        jest.mocked(deleteUserIngredient).mockResolvedValue(undefined);
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));
        await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

        expect(screen.queryByText(INGREDIENT_NAME)).not.toBeInTheDocument();
    });
});
