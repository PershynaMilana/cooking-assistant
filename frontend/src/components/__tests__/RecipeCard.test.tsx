import { screen } from "@testing-library/react";

import RecipeCard from "components/RecipeCard";

import { renderWithRouter } from "test/router";

const TITLE = "Borscht";

describe("RecipeCard", () => {
    it("should render the recipe title and a learn more link", () => {
        renderWithRouter(
            <RecipeCard
                id={1}
                title={TITLE}
                typeName="Soup"
                creationDate="2024-01-01"
                cookingTime={60}
            />,
        );

        expect(screen.getByText(TITLE)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Learn more" }),
        ).toBeInTheDocument();
    });
});
