import { screen } from "@testing-library/react";

import { GroupedRecipesList } from "components/menu/GroupedRecipesList";

import { renderWithRouter } from "test/router";

const GROUPED = {
    Soup: [
        {
            id: 10,
            recipe_id: 1,
            title: "Borscht",
            type_name: "Soup",
            cooking_time: 60,
            creation_date: "2024-01-01",
        },
    ],
};

describe("GroupedRecipesList", () => {
    it("should render type headings and recipe titles", () => {
        renderWithRouter(<GroupedRecipesList groupedRecipes={GROUPED} />);

        expect(screen.getByText("Soup:")).toBeInTheDocument();
        expect(screen.getByText("Borscht")).toBeInTheDocument();
    });
});
