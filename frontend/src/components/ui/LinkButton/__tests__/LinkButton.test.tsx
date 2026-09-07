import { screen } from "@testing-library/react";

import { LinkButton } from "components/ui/LinkButton";

import { renderWithRouter } from "test/router";

describe("LinkButton", () => {
    it("should render as a link to the given destination", () => {
        renderWithRouter(
            <LinkButton href="/add-recipe">New recipe</LinkButton>,
        );

        expect(
            screen.getByRole("link", { name: "New recipe" }),
        ).toHaveAttribute("href", "/add-recipe");
    });

    it("should apply the primary variant class by default", () => {
        renderWithRouter(
            <LinkButton href="/add-recipe">New recipe</LinkButton>,
        );

        expect(screen.getByRole("link")).toHaveClass("button--primary");
    });

    it("should apply the requested variant and size classes", () => {
        renderWithRouter(
            <LinkButton href="/add-recipe" variant="secondary" size="sm">
                New recipe
            </LinkButton>,
        );

        const link = screen.getByRole("link");

        expect(link).toHaveClass("button--secondary");
        expect(link).toHaveClass("button--sm");
    });
});
