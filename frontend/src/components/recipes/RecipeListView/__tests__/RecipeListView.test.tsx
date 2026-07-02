import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PAGE_SIZE } from "constants/pagination";
import type { RecipeListItem } from "types/recipe";

import type { RecipeFilterState } from "hooks/useRecipeListView";

import { RecipeListView } from "components/recipes/RecipeListView";

import { renderWithRouter } from "test/router";

const RECIPE_TITLE = "Borscht";

const RECIPES: RecipeListItem[] = [
    {
        id: 1,
        title: RECIPE_TITLE,
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 60,
    },
];

const FILTERS: RecipeFilterState = {
    selectedTypes: [],
    startDate: "",
    endDate: "",
    minCookingTime: "",
    maxCookingTime: "",
    sortOrder: "",
    ingredientName: null,
};

const baseProps = {
    filters: FILTERS,
    setSelectedTypes: jest.fn(),
    setStartDate: jest.fn(),
    setEndDate: jest.fn(),
    setMinCookingTime: jest.fn(),
    setMaxCookingTime: jest.fn(),
    setSortOrder: jest.fn(),
    types: [],
    descriptions: [],
    heading: "All recipes",
    emptyMessage: "No recipes found",
    searchPlaceholder: "ingredient name",
    total: RECIPES.length,
    loadedCount: RECIPES.length,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
    loadMoreError: null,
};

describe("RecipeListView", () => {
    it("should render the heading and a card per recipe", () => {
        renderWithRouter(
            <RecipeListView
                {...baseProps}
                recipes={RECIPES}
                noRecipes={false}
                error={null}
            />,
        );

        expect(screen.getByText("All recipes")).toBeInTheDocument();
        expect(screen.getByText(RECIPE_TITLE)).toBeInTheDocument();
    });

    it("should render the empty message instead of cards when there are no recipes", () => {
        renderWithRouter(
            <RecipeListView
                {...baseProps}
                recipes={[]}
                noRecipes={true}
                error={null}
            />,
        );

        expect(screen.getByText("No recipes found")).toBeInTheDocument();
        expect(screen.queryByText(RECIPE_TITLE)).not.toBeInTheDocument();
    });

    it("should render the error message when present", () => {
        renderWithRouter(
            <RecipeListView
                {...baseProps}
                recipes={[]}
                noRecipes={false}
                error="Boom"
            />,
        );

        expect(screen.getByText("Boom")).toBeInTheDocument();
    });

    it("should show the load more button and counter once total exceeds a page", () => {
        renderWithRouter(
            <RecipeListView
                {...baseProps}
                recipes={RECIPES}
                noRecipes={false}
                error={null}
                total={PAGE_SIZE + 1}
                hasNextPage={true}
            />,
        );

        expect(
            screen.getByText(`Showing ${RECIPES.length} of ${PAGE_SIZE + 1}`),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Load more" }),
        ).toBeInTheDocument();
    });

    it("should call fetchNextPage when the load more button is clicked", async () => {
        const fetchNextPage = jest.fn();

        renderWithRouter(
            <RecipeListView
                {...baseProps}
                recipes={RECIPES}
                noRecipes={false}
                error={null}
                hasNextPage={true}
                fetchNextPage={fetchNextPage}
            />,
        );

        await userEvent.click(
            screen.getByRole("button", { name: "Load more" }),
        );

        expect(fetchNextPage).toHaveBeenCalledTimes(1);
    });

    it("should render the load more error while keeping previously loaded recipes", () => {
        renderWithRouter(
            <RecipeListView
                {...baseProps}
                recipes={RECIPES}
                noRecipes={false}
                error={null}
                hasNextPage={true}
                loadMoreError="Couldn't load more"
            />,
        );

        expect(screen.getByText(RECIPE_TITLE)).toBeInTheDocument();
        expect(screen.getByText("Couldn't load more")).toBeInTheDocument();
    });
});
