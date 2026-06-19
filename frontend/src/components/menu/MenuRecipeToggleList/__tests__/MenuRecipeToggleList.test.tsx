import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuRecipeToggleList } from "components/menu/MenuRecipeToggleList";

import { ERROR_RECIPES_REQUIRED } from "test/constants";

const RECIPES = [
    {
        id: 1,
        title: "Borscht",
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 60,
    },
    {
        id: 2,
        title: "Varenyky",
        type_name: "Main",
        creation_date: "2024-01-02",
        cooking_time: 30,
    },
];

describe("MenuRecipeToggleList", () => {
    it("should render a button for each recipe", () => {
        render(
            <MenuRecipeToggleList
                allRecipes={RECIPES}
                selectedRecipes={[]}
                onToggle={jest.fn()}
                label="Select recipes"
                errorMessage={null}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Borscht" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Varenyky" }),
        ).toBeInTheDocument();
    });

    it("should call onToggle with recipe id when button is clicked", async () => {
        const onToggle = jest.fn();

        render(
            <MenuRecipeToggleList
                allRecipes={RECIPES}
                selectedRecipes={[]}
                onToggle={onToggle}
                label="Select recipes"
                errorMessage={null}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Borscht" }));

        expect(onToggle).toHaveBeenCalledWith(1);
    });

    it("should display error message when provided", () => {
        render(
            <MenuRecipeToggleList
                allRecipes={RECIPES}
                selectedRecipes={[]}
                onToggle={jest.fn()}
                label="Select recipes"
                errorMessage={ERROR_RECIPES_REQUIRED}
            />,
        );

        expect(screen.getByText(ERROR_RECIPES_REQUIRED)).toBeInTheDocument();
    });

    it("should not display error message when null", () => {
        render(
            <MenuRecipeToggleList
                allRecipes={RECIPES}
                selectedRecipes={[]}
                onToggle={jest.fn()}
                label="Select recipes"
                errorMessage={null}
            />,
        );

        expect(
            screen.queryByText(ERROR_RECIPES_REQUIRED),
        ).not.toBeInTheDocument();
    });
});
