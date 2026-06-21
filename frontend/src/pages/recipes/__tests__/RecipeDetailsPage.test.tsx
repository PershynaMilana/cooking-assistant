import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RecipeDetails } from "types/recipe";

import { deleteRecipe, getRecipeById } from "api/recipesApi";

import RecipeDetailsPage from "pages/recipes/RecipeDetailsPage";
import { BTN_DELETE_RECIPE, BTN_EDIT_RECIPE, ROUTE_MAIN } from "test/constants";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipesApi");

const TITLE = "Borscht";
const OWNER_ID = 3;
const SAMPLE: RecipeDetails = {
    id: 1,
    title: TITLE,
    content: "boil",
    ingredients: [],
    type_id: 2,
    type_name: "Soup",
    cooking_time: 60,
    creation_date: "2024-01-01",
    servings: 4,
    person_id: OWNER_ID,
    isOwner: true,
};

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={["/recipe/1"]}>
            <Routes>
                <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            </Routes>
        </MemoryRouter>,
    );

describe("RecipeDetailsPage", () => {
    it("should render the recipe title loaded from the api", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(SAMPLE);

        renderPage();

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });

    it("should show Edit and Delete buttons when current user is the recipe owner", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(SAMPLE);

        renderPage();

        await screen.findByText(TITLE);

        expect(
            screen.getByRole("button", { name: BTN_EDIT_RECIPE }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: BTN_DELETE_RECIPE }),
        ).toBeInTheDocument();
    });

    it("should navigate to /main after successful delete", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(SAMPLE);
        jest.mocked(deleteRecipe).mockResolvedValue(undefined);

        renderPage();

        await screen.findByText(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_DELETE_RECIPE }),
        );
        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(mockNavigate).toHaveBeenCalledWith(ROUTE_MAIN);
    });

    it("should show an error message when the recipe fails to load", async () => {
        jest.mocked(getRecipeById).mockRejectedValue(new Error("boom"));

        renderPage();

        expect(
            await screen.findByText("Error: Error fetching recipe details"),
        ).toBeInTheDocument();
    });

    it("should render cooking time in minutes only when under an hour", async () => {
        jest.mocked(getRecipeById).mockResolvedValue({
            ...SAMPLE,
            cooking_time: 45,
        });

        renderPage();

        await screen.findByText(TITLE);

        expect(screen.getByText("45 minutes")).toBeInTheDocument();
    });

    it("should close the delete confirmation modal when cancelled", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(SAMPLE);

        renderPage();

        await screen.findByText(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_DELETE_RECIPE }),
        );

        const cancelButton = screen.getByRole("button", { name: "Cancel" });

        await userEvent.click(cancelButton);

        expect(
            screen.queryByRole("button", { name: "Cancel" }),
        ).not.toBeInTheDocument();
    });
});
