import { useAppDispatch, useAppSelector } from "redux/hooks";
import { selectActiveModal } from "redux/selectors/uiSelectors";
import { closeModal, MODAL_TYPE } from "redux/slices/uiSlice";

import { PurchaseHistoryModal } from "components/ingredients/PurchaseHistoryModal";

// renders the active modal from the ui slice; new modal types are added here as
// they move to the global manager (page wiring lands in the 3.0 release)
export const ModalRoot = () => {
    const modal = useAppSelector(selectActiveModal);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        if (modal) {
            dispatch(closeModal(modal.id));
        }
    };

    if (modal?.type === MODAL_TYPE.ingredientHistory) {
        return (
            <PurchaseHistoryModal
                ingredientId={modal.ingredientId}
                ingredientName={modal.ingredientName}
                onClose={handleClose}
            />
        );
    }

    return null;
};
