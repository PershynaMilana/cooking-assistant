import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RecipeTypeSummary } from "types/recipeType";

import { deleteRecipeType, getRecipeTypes } from "api/recipeTypesApi";

import TypesPage from "pages/recipe-types/TypesPage";
import { renderWithRouter } from "test/router";

jest.mock("api/recipeTypesApi");

const TYPE_NAME = "Soup";
const DELETE_ERROR = "Server error";
const SAMPLE: RecipeTypeSummary[] = [
    { id: 1, type_name: TYPE_NAME, description: "warm" },
];

describe("TypesPage", () => {
    it("should render the recipe types loaded from the api", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(SAMPLE);

        renderWithRouter(<TypesPage />);

        expect(await screen.findByText(TYPE_NAME)).toBeInTheDocument();
    });

    it("should delete the selected type after confirming in the modal", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(SAMPLE);
        jest.mocked(deleteRecipeType).mockResolvedValue(undefined);

        renderWithRouter(<TypesPage />);

        await screen.findByText(TYPE_NAME);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        const deleteButtons = screen.getAllByRole("button", { name: "Delete" });

        await userEvent.click(deleteButtons[deleteButtons.length - 1]);

        expect(jest.mocked(deleteRecipeType)).toHaveBeenCalledWith(1);
    });

    it("should show an error message when deletion fails", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(SAMPLE);
        jest.mocked(deleteRecipeType).mockRejectedValue(
            new Error(DELETE_ERROR),
        );

        renderWithRouter(<TypesPage />);

        await screen.findByText(TYPE_NAME);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        const deleteButtons = screen.getAllByRole("button", { name: "Delete" });

        await userEvent.click(deleteButtons[deleteButtons.length - 1]);

        expect(await screen.findByText(DELETE_ERROR)).toBeInTheDocument();
    });

    it("should clear the delete error when the modal is closed", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(SAMPLE);
        jest.mocked(deleteRecipeType).mockRejectedValue(
            new Error(DELETE_ERROR),
        );

        renderWithRouter(<TypesPage />);

        await screen.findByText(TYPE_NAME);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        const deleteButtons = screen.getAllByRole("button", { name: "Delete" });

        await userEvent.click(deleteButtons[deleteButtons.length - 1]);

        expect(await screen.findByText(DELETE_ERROR)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(screen.queryByText(DELETE_ERROR)).not.toBeInTheDocument();
    });
});
