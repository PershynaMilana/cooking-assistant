import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { ROUTES } from "constants/routes";

import { API_ROUTES } from "api/endpoints";

import type { ActiveModal } from "redux/slices/uiSlice";
import { MODAL_TYPE } from "redux/slices/uiSlice";

import { DeleteRecipeModal } from "components/ui/ModalRoot/DeleteRecipeModal";

import { mockedDelete } from "test/apiClientMock";
import { mockNavigate, renderWithProviders } from "test/router";
import { makeTestStore } from "test/store";

jest.mock("api/client");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const RECIPE_ID = "42";
const MODAL_ID = "m1";
const MODAL: ActiveModal = {
    id: MODAL_ID,
    type: MODAL_TYPE.deleteRecipe,
    recipeId: RECIPE_ID,
};

const renderOpen = () => {
    const store = makeTestStore({ ui: { modal: MODAL } });
    const view = renderWithProviders(
        <DeleteRecipeModal modalId={MODAL_ID} recipeId={RECIPE_ID} />,
        { store },
    );

    return view;
};

const clickConfirm = () =>
    userEvent.click(screen.getByRole("button", { name: "Delete" }));

describe("DeleteRecipeModal", () => {
    it("should render the delete confirmation", () => {
        renderOpen();

        expect(
            screen.getByText("Are you sure you want to delete this recipe?"),
        ).toBeInTheDocument();
    });

    it("should delete the recipe, notify, close and navigate on confirm", async () => {
        mockedDelete.mockResolvedValue({ data: null });
        const { store } = renderOpen();

        await clickConfirm();

        expect(mockedDelete).toHaveBeenCalledWith(
            API_ROUTES.recipes.byId(RECIPE_ID),
            { params: undefined },
        );
        expect(store.getState().notifications.items).toEqual([
            expect.objectContaining({
                type: "success",
                message: "Recipe deleted",
            }),
        ]);
        expect(store.getState().ui.modal).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.main);
    });

    it("should close the modal without deleting on cancel", async () => {
        const { store } = renderOpen();

        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(mockedDelete).not.toHaveBeenCalled();
        expect(store.getState().ui.modal).toBeNull();
    });

    it("should keep the modal open and not navigate when deletion fails", async () => {
        mockedDelete.mockRejectedValue({
            isAxiosError: true,
            response: { status: 500, data: { error: "Boom" } },
            message: "Request failed",
        });
        const { store } = renderOpen();

        await clickConfirm();

        expect(store.getState().ui.modal).toEqual(MODAL);
        expect(store.getState().notifications.items).toEqual([
            expect.objectContaining({ type: "error", message: "Boom" }),
        ]);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
