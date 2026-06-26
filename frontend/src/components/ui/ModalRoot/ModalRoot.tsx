import { useAppDispatch, useAppSelector } from "redux/hooks";
import { selectActiveModal } from "redux/selectors/uiSelectors";
import { closeModal, MODAL_TYPE } from "redux/slices/uiSlice";

import { PurchaseHistoryModal } from "components/ingredients/PurchaseHistoryModal";
import { DeleteIngredientModal } from "components/ui/ModalRoot/DeleteIngredientModal";
import { DeleteMenuModal } from "components/ui/ModalRoot/DeleteMenuModal";
import { DeleteRecipeModal } from "components/ui/ModalRoot/DeleteRecipeModal";

// renders the active modal from the ui slice; each modal type maps to one
// container that owns its own data/mutations
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

    if (modal?.type === MODAL_TYPE.deleteRecipe) {
        return (
            <DeleteRecipeModal modalId={modal.id} recipeId={modal.recipeId} />
        );
    }

    if (modal?.type === MODAL_TYPE.deleteMenu) {
        return <DeleteMenuModal modalId={modal.id} menuId={modal.menuId} />;
    }

    if (modal?.type === MODAL_TYPE.deleteIngredient) {
        return (
            <DeleteIngredientModal
                modalId={modal.id}
                ingredient={modal.ingredient}
            />
        );
    }

    return null;
};
