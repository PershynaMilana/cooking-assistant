import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Purchase } from "types/userIngredient";

import { getApiErrorMessage } from "api/httpError";
import { getPurchaseHistory, updatePurchase } from "api/userIngredientsApi";

import { getCurrentUserId } from "utils/getCurrentUserId";

export const usePurchaseHistory = (ingredientId: number) => {
    const { t } = useTranslation("ingredients");
    const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            try {
                const userId = getCurrentUserId();

                if (userId === null) {
                    setError(t("purchaseModal.errorNoToken"));
                    setLoading(false);

                    return;
                }

                const data = await getPurchaseHistory(userId, ingredientId);

                setPurchaseHistory(data);
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        void fetchHistory();
    }, [ingredientId, t]);

    const handleQuantityChange = useCallback(
        (id: number, newQuantity: number) => {
            setPurchaseHistory((prev) =>
                prev.map((purchase) =>
                    purchase.id === id
                        ? { ...purchase, quantity: newQuantity }
                        : purchase,
                ),
            );
        },
        [],
    );

    const saveChange = useCallback(
        async (id: number, newQuantity: number) => {
            setLoading(true);

            try {
                const userId = getCurrentUserId();

                if (userId === null) {
                    setError(t("purchaseModal.errorNoToken"));
                    setLoading(false);

                    return;
                }

                await updatePurchase(userId, id, { quantity: newQuantity });

                setPurchaseHistory((prev) =>
                    prev.map((purchase) =>
                        purchase.id === id
                            ? { ...purchase, quantity: newQuantity }
                            : purchase,
                    ),
                );
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    return {
        purchaseHistory,
        loading,
        error,
        handleQuantityChange,
        saveChange,
    };
};
