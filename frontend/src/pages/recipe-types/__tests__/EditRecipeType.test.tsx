import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RecipeTypeFormData } from "types/recipeType";

import { getRecipeTypeById, updateRecipeType } from "api/recipeTypesApi";

import EditRecipeType from "pages/recipe-types/EditRecipeType";

jest.mock("api/recipeTypesApi");

const ID = "5";
const TYPE_NAME = "Dessert";
const DESCRIPTION = "Sweet dishes";
const SAMPLE: RecipeTypeFormData = {
    type_name: TYPE_NAME,
    description: DESCRIPTION,
};

describe("EditRecipeType", () => {
    it("should redirect to the types list when id is missing", () => {
        render(
            <MemoryRouter initialEntries={["/edit-unknown"]}>
                <Routes>
                    <Route path="/edit-unknown" element={<EditRecipeType />} />
                    <Route path="/types" element={<div>Types List</div>} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText("Types List")).toBeInTheDocument();
    });

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
