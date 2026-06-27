import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import type * as ReactRouterDom from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { MenuDetails } from "types/menu";

import { API_ROUTES } from "api/endpoints";

import { MODAL_TYPE } from "redux/slices/uiSlice";

import { ModalRoot } from "components/ui/Modals";

import MenuDetailsPage from "pages/menu/MenuDetailsPage";
import { mockedDelete, mockedGet } from "test/apiClientMock";
import { BTN_DELETE_MENU, ROUTE_MENU } from "test/constants";
import { mockNavigate } from "test/router";
import { makeTestStore } from "test/store";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/client");

const TITLE = "Weekday menu";
const OWNER_ID = 5;
const SAMPLE: MenuDetails = {
    menu: {
        id: 1,
        title: TITLE,
        categoryname: "Lunch",
        menucontent: "quick",
        category_id: 2,
        personid: OWNER_ID,
        isOwner: true,
    },
    recipes: [],
};

const renderPage = (store = makeTestStore()) => {
    const view = render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/menu/1"]}>
                <Routes>
                    <Route
                        path="/menu/:id"
                        element={
                            <>
                                <MenuDetailsPage />
                                <ModalRoot />
                            </>
                        }
                    />
                </Routes>
            </MemoryRouter>
        </Provider>,
    );

    return { store, ...view };
};

describe("MenuDetailsPage", () => {
    it("should render the menu title loaded from the api", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE });

        renderPage();

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });

    it("should show Delete button when current user is the menu owner", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE });

        renderPage();
        await screen.findByText(TITLE);

        expect(
            screen.getByRole("button", { name: BTN_DELETE_MENU }),
        ).toBeInTheDocument();
    });

    it("should open the global delete modal and navigate to /menu after delete", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE });
        mockedDelete.mockResolvedValue({ data: null });

        const { store } = renderPage();

        await screen.findByText(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_DELETE_MENU }),
        );

        expect(store.getState().ui.modal?.type).toBe(MODAL_TYPE.deleteMenu);

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(mockedDelete).toHaveBeenCalledWith(API_ROUTES.menu.byId(1), {
            params: undefined,
        });
        expect(mockNavigate).toHaveBeenCalledWith(ROUTE_MENU);
    });

    it("should render the error message when loading the menu fails", async () => {
        mockedGet.mockRejectedValue(new Error("boom"));

        renderPage();

        expect(await screen.findByText(/Error:/)).toBeInTheDocument();
    });

    it("should close the modal when Cancel is clicked", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE });

        const { store } = renderPage();

        await screen.findByText(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_DELETE_MENU }),
        );
        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(store.getState().ui.modal).toBeNull();
    });
});
