import { act } from "@testing-library/react";

import type { ActiveModal } from "redux/slices/uiSlice";
import { MODAL_TYPE } from "redux/slices/uiSlice";

import { PurchaseHistoryModal } from "components/ingredients/PurchaseHistoryModal";
import { ModalRoot } from "components/ui/ModalRoot";

import { renderWithProviders } from "test/router";
import { makeTestStore } from "test/store";

jest.mock("components/ingredients/PurchaseHistoryModal", () => ({
    PurchaseHistoryModal: jest.fn(() => null),
}));

const mockedModal = jest.mocked(PurchaseHistoryModal);

const MODAL: ActiveModal = {
    id: "modal-1",
    type: MODAL_TYPE.ingredientHistory,
    ingredientId: 7,
    ingredientName: "Salt",
};

describe("ModalRoot", () => {
    it("should render the history modal for the ingredientHistory type", () => {
        renderWithProviders(<ModalRoot />, {
            store: makeTestStore({ ui: { modal: MODAL } }),
        });

        expect(mockedModal).toHaveBeenCalled();

        const props = mockedModal.mock.calls[0][0];

        expect(props.ingredientId).toBe(7);
        expect(props.ingredientName).toBe("Salt");
    });

    it("should close the modal when the child requests it", () => {
        const store = makeTestStore({ ui: { modal: MODAL } });

        renderWithProviders(<ModalRoot />, { store });

        const props = mockedModal.mock.calls[0][0];

        act(() => {
            props.onClose();
        });

        expect(store.getState().ui.modal).toBeNull();
    });

    it("should render nothing when no modal is open", () => {
        const { container } = renderWithProviders(<ModalRoot />, {
            store: makeTestStore(),
        });

        expect(container).toBeEmptyDOMElement();
        expect(mockedModal).not.toHaveBeenCalled();
    });
});
