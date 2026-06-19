import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RecipeDetails } from "types/recipe";

import { deleteRecipe, getRecipeById } from "api/recipesApi";

import RecipeDetailsPage from "pages/recipes/RecipeDetailsPage";
import { mockJwtUser, setAuthToken } from "test/auth";
import { BTN_DELETE_RECIPE, BTN_EDIT_RECIPE, ROUTE_MAIN } from "test/constants";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipesApi");
jest.mock("jwt-decode");

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
    servings: "4",
    person_id: OWNER_ID,
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
        setAuthToken();
        mockJwtUser(OWNER_ID);
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

    it("should not show Edit and Delete buttons for a non-owner", async () => {
        setAuthToken();
        mockJwtUser(99);
        jest.mocked(getRecipeById).mockResolvedValue(SAMPLE);

        renderPage();

        await screen.findByText(TITLE);

        expect(
            screen.queryByRole("button", { name: BTN_DELETE_RECIPE }),
        ).not.toBeInTheDocument();
    });

    it("should navigate to /main after successful delete", async () => {
        setAuthToken();
        mockJwtUser(OWNER_ID);
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
});
