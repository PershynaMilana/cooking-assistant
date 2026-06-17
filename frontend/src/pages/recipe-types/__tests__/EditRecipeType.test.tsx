import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditRecipeType from "../EditRecipeType";
import {
    getRecipeTypeById,
    updateRecipeType,
} from "../../../api/recipeTypesApi";
import type { RecipeTypeFormData } from "../../../types/recipeType";

jest.mock("../../../api/recipeTypesApi");

const ID = "5";
const TYPE_NAME = "Dessert";
const DESCRIPTION = "Sweet dishes";
const SAMPLE: RecipeTypeFormData = {
    type_name: TYPE_NAME,
    description: DESCRIPTION,
};

describe("EditRecipeType", () => {
    it("should load the recipe type and update it on submit", async () => {
        jest.mocked(getRecipeTypeById).mockResolvedValue(SAMPLE);
        const mockedUpdate = jest.mocked(updateRecipeType);
        mockedUpdate.mockResolvedValue(undefined);

        render(
            <MemoryRouter initialEntries={[`/types/${ID}`]}>
                <Routes>
                    <Route path="/types/:id" element={<EditRecipeType />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByDisplayValue(TYPE_NAME)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(mockedUpdate).toHaveBeenCalledWith(ID, SAMPLE);
    });
});
