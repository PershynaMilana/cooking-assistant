import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Purchase } from "types/userIngredient";

import {
    useGetPurchaseHistoryQuery,
    useUpdatePurchaseMutation,
} from "redux/services/userIngredientsApi";

import { PurchaseItem } from "components/ingredients/PurchaseItem";
import { BaseModal } from "components/modals/BaseModal";

import { getQueryErrorMessage } from "utils/queryError";

interface PurchaseHistoryModalProps {
    ingredientId: number;
    ingredientName: string;
    onClose: () => void;
}

export const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({
    ingredientId,
    ingredientName,
    onClose,
}) => {
    const { t, i18n } = useTranslation("ingredients");
    const {
        data: history,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetPurchaseHistoryQuery(ingredientId);
    const [updatePurchase] = useUpdatePurchaseMutation();
    const [items, setItems] = useState<Purchase[]>([]);

    // seed once - a later refetch must not overwrite unsaved edits in other rows
    const seeded = useRef(false);

    useEffect(() => {
        if (isSuccess && !seeded.current) {
            seeded.current = true;
            setItems(history);
        }
    }, [isSuccess, history]);

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setItems((prev) =>
            prev.map((purchase) =>
                purchase.id === id
                    ? { ...purchase, quantity: newQuantity }
                    : purchase,
            ),
        );
    };

    const handleSave = async (id: number, newQuantity: number) => {
        // a failed mutation is already toasted by the global listener
        await updatePurchase({
            purchaseId: id,
            body: { quantity: newQuantity },
        });
    };

    const isEmpty = !isLoading && !isError && items.length === 0;
    const hasHistory = !isLoading && !isError && items.length > 0;

    return (
        <BaseModal
            size="md"
            title={t("purchaseModal.title", { name: ingredientName })}
            onClose={onClose}
        >
            {isLoading && <p>{t("purchaseModal.loading")}</p>}
            {isError && (
                <p className="text-red-500">{getQueryErrorMessage(error)}</p>
            )}
            {isEmpty && <p>{t("purchaseModal.noHistory")}</p>}
            {hasHistory && (
                <ul className="space-y-2">
                    {items.map((purchase) => (
                        <PurchaseItem
                            key={purchase.id}
                            purchase={purchase}
                            language={i18n.language}
                            onQuantityChange={handleQuantityChange}
                            onSave={handleSave}
                        />
                    ))}
                </ul>
            )}
            <button
                onClick={onClose}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full"
            >
                {t("purchaseModal.closeButton")}
            </button>
        </BaseModal>
    );
};
