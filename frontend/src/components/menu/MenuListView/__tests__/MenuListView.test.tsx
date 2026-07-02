import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PAGE_SIZE } from "constants/pagination";
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
    total: MENUS.length,
    loadedCount: MENUS.length,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
    loadMoreError: null,
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

    it("should show the load more button and counter once total exceeds a page", () => {
        renderWithRouter(
            <MenuListView
                {...baseProps}
                menus={MENUS}
                noMenus={false}
                error={null}
                total={PAGE_SIZE + 1}
                hasNextPage={true}
            />,
        );

        expect(
            screen.getByText(`Showing ${MENUS.length} of ${PAGE_SIZE + 1}`),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Load more" }),
        ).toBeInTheDocument();
    });

    it("should call fetchNextPage when the load more button is clicked", async () => {
        const fetchNextPage = jest.fn();

        renderWithRouter(
            <MenuListView
                {...baseProps}
                menus={MENUS}
                noMenus={false}
                error={null}
                hasNextPage={true}
                fetchNextPage={fetchNextPage}
            />,
        );

        await userEvent.click(
            screen.getByRole("button", { name: "Load more" }),
        );

        expect(fetchNextPage).toHaveBeenCalledTimes(1);
    });

    it("should render the load more error while keeping previously loaded menus", () => {
        renderWithRouter(
            <MenuListView
                {...baseProps}
                menus={MENUS}
                noMenus={false}
                error={null}
                hasNextPage={true}
                loadMoreError="Couldn't load more"
            />,
        );

        expect(screen.getByText(MENU_TITLE)).toBeInTheDocument();
        expect(screen.getByText("Couldn't load more")).toBeInTheDocument();
    });
});
