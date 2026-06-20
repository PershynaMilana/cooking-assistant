import { useCallback, useEffect, useState } from "react";

import type { Purchase } from "types/userIngredient";

import { getApiErrorMessage } from "api/httpError";
import { getPurchaseHistory, updatePurchase } from "api/userIngredientsApi";

export const usePurchaseHistory = (ingredientId: number) => {
    const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            try {
                const data = await getPurchaseHistory(ingredientId);

                setPurchaseHistory(data);
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        void fetchHistory();
    }, [ingredientId]);

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

    const saveChange = useCallback(async (id: number, newQuantity: number) => {
        setLoading(true);

        try {
            await updatePurchase(id, { quantity: newQuantity });

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
    }, []);

    return {
        purchaseHistory,
        loading,
        error,
        handleQuantityChange,
        saveChange,
    };
};
