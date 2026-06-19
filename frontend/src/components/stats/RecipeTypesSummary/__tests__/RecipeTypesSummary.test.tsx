import { render, screen } from "@testing-library/react";

import { RecipeTypesSummary } from "components/stats/RecipeTypesSummary";

describe("RecipeTypesSummary", () => {
    it("should render type names and counts", () => {
        render(
            <RecipeTypesSummary
                stats={[{ typeName: "Soup", count: 3 }]}
                fastestRecipes={[]}
                slowestRecipes={[]}
                mostIngredientsRecipes={[]}
                leastIngredientsRecipes={[]}
            />,
        );

        expect(screen.getByText("Soup")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    });
});
