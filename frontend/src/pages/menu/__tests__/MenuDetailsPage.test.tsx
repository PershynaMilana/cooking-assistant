import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { MenuDetails } from "types/menu";

import { deleteMenu, getMenuById } from "api/menusApi";

import MenuDetailsPage from "pages/menu/MenuDetailsPage";
import { mockJwtUser, setAuthToken } from "test/auth";
import { BTN_DELETE_MENU, ROUTE_MENU } from "test/constants";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/menusApi");
jest.mock("jwt-decode");

const TITLE = "Weekday menu";
const OWNER_ID = 5;
const SAMPLE: MenuDetails = {
    menu: {
        id: 1,
        title: TITLE,
        categoryname: "Lunch",
        menucontent: "quick",
        personid: OWNER_ID,
    },
    recipes: [],
};

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={["/menu/1"]}>
            <Routes>
                <Route path="/menu/:id" element={<MenuDetailsPage />} />
            </Routes>
        </MemoryRouter>,
    );

describe("MenuDetailsPage", () => {
    it("should render the menu title loaded from the api", async () => {
        jest.mocked(getMenuById).mockResolvedValue(SAMPLE);

        renderPage();

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });

    it("should show Delete button when current user is the menu owner", async () => {
        setAuthToken();
        mockJwtUser(OWNER_ID);
        jest.mocked(getMenuById).mockResolvedValue(SAMPLE);

        renderPage();

        await screen.findByText(TITLE);

        expect(
            screen.getByRole("button", { name: BTN_DELETE_MENU }),
        ).toBeInTheDocument();
    });

    it("should not show Delete button for a non-owner", async () => {
        setAuthToken();
        mockJwtUser(99);
        jest.mocked(getMenuById).mockResolvedValue(SAMPLE);

        renderPage();

        await screen.findByText(TITLE);

        expect(
            screen.queryByRole("button", { name: BTN_DELETE_MENU }),
        ).not.toBeInTheDocument();
    });

    it("should navigate to /menu after successful delete", async () => {
        setAuthToken();
        mockJwtUser(OWNER_ID);
        jest.mocked(getMenuById).mockResolvedValue(SAMPLE);
        jest.mocked(deleteMenu).mockResolvedValue(undefined);

        renderPage();

        await screen.findByText(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_DELETE_MENU }),
        );
        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(mockNavigate).toHaveBeenCalledWith(ROUTE_MENU);
    });
});
