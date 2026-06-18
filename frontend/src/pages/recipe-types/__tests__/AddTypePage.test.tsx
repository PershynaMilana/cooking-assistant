import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createRecipeType } from "api/recipeTypesApi";

import AddTypePage from "pages/recipe-types/AddTypePage";
import { renderWithRouter } from "test/router";

jest.mock("../../../api/recipeTypesApi");

const TYPE_NAME = "Dessert";
const DESCRIPTION = "Sweet dishes";

describe("AddTypePage", () => {
    it("should create the recipe type on submit", async () => {
        const mockedCreate = jest.mocked(createRecipeType);

        mockedCreate.mockResolvedValue(undefined);

        renderWithRouter(<AddTypePage />);

        await userEvent.type(screen.getByLabelText("Name:"), TYPE_NAME);
        await userEvent.type(
            screen.getByLabelText("Description:"),
            DESCRIPTION,
        );
        await userEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(mockedCreate).toHaveBeenCalledWith({
            type_name: TYPE_NAME,
            description: DESCRIPTION,
        });
    });
});
