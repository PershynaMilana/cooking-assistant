import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Ingredient } from "types/ingredient";
import type { UserIngredient } from "types/userIngredient";

import { API_ROUTES } from "api/endpoints";

import { ModalRoot } from "components/ui/ModalRoot";

import IngredientsPage from "pages/person-ingredients/IngredientsPage";
import { mockedDelete, mockedGet, mockedPut } from "test/apiClientMock";
import { BTN_EDIT_INGREDIENTS } from "test/constants";
import { renderWithProviders } from "test/router";

jest.mock("api/client");

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

let pantry: UserIngredient[];

const setup = () => {
    pantry = USER_INGREDIENTS;
    mockedGet.mockImplementation((url: string) => {
        if (url === API_ROUTES.ingredients.list) {
            return Promise.resolve({ data: ALL_INGREDIENTS });
        }

        if (url === API_ROUTES.userIngredients.list) {
            return Promise.resolve({ data: pantry });
        }

        return Promise.reject(new Error(`unexpected GET ${url}`));
    });

    return renderWithProviders(
        <>
            <IngredientsPage />
            <ModalRoot />
        </>,
    );
};

const deleteMessage = `Are you sure you want to delete the ingredient "${INGREDIENT_NAME}"?`;

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
        mockedPut.mockResolvedValue({ data: null });
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

        expect(screen.getByText(deleteMessage)).toBeInTheDocument();
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
        mockedPut.mockResolvedValue({ data: null });
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

        expect(screen.queryByText(deleteMessage)).not.toBeInTheDocument();
    });

    it("should remove the ingredient from the list after confirming delete", async () => {
        mockedDelete.mockImplementation(() => {
            pantry = [];

            return Promise.resolve({ data: null });
        });
        setup();

        await screen.findByText(INGREDIENT_NAME);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));
        await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

        // RTK Query refetch after Pantry tag invalidation is async; wait for
        // the empty-state text before asserting the ingredient is gone
        await screen.findByText("You currently have no ingredients.");
        expect(screen.queryByText(INGREDIENT_NAME)).not.toBeInTheDocument();
    });
});
