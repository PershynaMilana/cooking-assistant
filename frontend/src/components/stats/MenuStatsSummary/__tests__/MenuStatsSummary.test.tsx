import { screen } from "@testing-library/react";

import { MenuStatsSummary } from "components/stats/MenuStatsSummary";

import { renderWithRouter } from "test/router";

describe("MenuStatsSummary", () => {
    it("should render total menus count", () => {
        renderWithRouter(
            <MenuStatsSummary
                menusCount={5}
                recipesCount={12}
                averageCookingTimes={[]}
            />,
        );

        expect(screen.getByText(/5/)).toBeInTheDocument();
    });

    it("should render average cooking times", () => {
        renderWithRouter(
            <MenuStatsSummary
                menusCount={0}
                recipesCount={0}
                averageCookingTimes={[
                    { typeName: "Soup", averageCookingTime: "30" },
                    { typeName: "Salad", averageCookingTime: "15" },
                ]}
            />,
        );

        expect(screen.getByText("Soup")).toBeInTheDocument();
        expect(screen.getByText("Salad")).toBeInTheDocument();
    });
});
