import { render, screen } from "@testing-library/react";

import { RecipeExtremeList } from "components/stats/RecipeExtremeList";

const RECIPES = [
    {
        id: 1,
        title: "Borscht",
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 30,
        ingredients: ["beet"],
    },
];

describe("RecipeExtremeList", () => {
    it("should render label and recipe with formatted value", () => {
        render(
            <RecipeExtremeList
                label="Fastest Recipes:"
                recipes={RECIPES}
                unit=" min"
                getValue={(r) => r.cooking_time}
            />,
        );

        expect(screen.getByText("Fastest Recipes:")).toBeInTheDocument();
        expect(screen.getByText(/Borscht/)).toBeInTheDocument();
        expect(screen.getByText(/30/)).toBeInTheDocument();
    });
});
