import { screen } from "@testing-library/react";

import { MenuCard } from "components/menu/MenuCard";

import { renderWithRouter } from "test/router";

const TITLE = "Weekday menu";
const CATEGORY = "Lunch";

describe("MenuCard", () => {
    it("should render the menu title, category and a learn more button", () => {
        renderWithRouter(
            <MenuCard
                id={1}
                title={TITLE}
                content="quick meals"
                categoryName={CATEGORY}
            />,
        );

        expect(screen.getByText(TITLE)).toBeInTheDocument();
        expect(screen.getByText(CATEGORY)).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Learn more" }),
        ).toBeInTheDocument();
    });
});
