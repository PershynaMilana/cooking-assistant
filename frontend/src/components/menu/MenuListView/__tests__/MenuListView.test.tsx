import { screen } from "@testing-library/react";

import type { Menu } from "types/menu";

import { MenuListView } from "components/menu/MenuListView";

import { renderWithRouter } from "test/router";

const MENU_TITLE = "Weekday menu";

const MENUS: Menu[] = [
    {
        id: 1,
        title: MENU_TITLE,
        categoryname: "Lunch",
        menucontent: "quick",
    },
];

const baseProps = {
    selectedCategories: [],
    setSelectedCategories: jest.fn(),
    categories: [],
    heading: "All menus",
    emptyMessage: "No menus found",
    searchPlaceholder: "menu title",
};

describe("MenuListView", () => {
    it("should render the heading and a card per menu", () => {
        renderWithRouter(
            <MenuListView
                {...baseProps}
                menus={MENUS}
                noMenus={false}
                error={null}
            />,
        );

        expect(screen.getByText("All menus")).toBeInTheDocument();
        expect(screen.getByText(MENU_TITLE)).toBeInTheDocument();
    });

    it("should render the empty message instead of cards when there are no menus", () => {
        renderWithRouter(
            <MenuListView
                {...baseProps}
                menus={[]}
                noMenus={true}
                error={null}
            />,
        );

        expect(screen.getByText("No menus found")).toBeInTheDocument();
        expect(screen.queryByText(MENU_TITLE)).not.toBeInTheDocument();
    });

    it("should render the error message when present", () => {
        renderWithRouter(
            <MenuListView
                {...baseProps}
                menus={[]}
                noMenus={false}
                error="Boom"
            />,
        );

        expect(screen.getByText("Boom")).toBeInTheDocument();
    });
});
