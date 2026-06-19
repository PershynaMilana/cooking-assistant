import { screen } from "@testing-library/react";

import { RecipeCard } from "components/recipes/RecipeCard";

import { renderWithRouter } from "test/router";

const TITLE = "Borscht";
const TYPE = "Soup";

describe("RecipeCard", () => {
    it("should render title, type, cooking time and a learn more button", () => {
        renderWithRouter(
            <RecipeCard
                id={1}
                title={TITLE}
                typeName={TYPE}
                creationDate="2024-01-15"
                cookingTime={90}
            />,
        );

        expect(screen.getByText(TITLE)).toBeInTheDocument();
        expect(screen.getByText(TYPE)).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Learn more" }),
        ).toBeInTheDocument();
        expect(screen.getByText(/1 hr : 30 min/)).toBeInTheDocument();
    });
});
