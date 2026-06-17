import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RecipeDetailsPage from "../RecipeDetailsPage";
import { getRecipeById } from "../../../api/recipesApi";
import type { RecipeDetails } from "../../../types/recipe";

jest.mock("../../../api/recipesApi");

const TITLE = "Borscht";
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

describe("RecipeDetailsPage", () => {
    it("should render the recipe title loaded from the api", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(SAMPLE);

        render(
            <MemoryRouter initialEntries={["/recipe/1"]}>
                <Routes>
                    <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });
});
