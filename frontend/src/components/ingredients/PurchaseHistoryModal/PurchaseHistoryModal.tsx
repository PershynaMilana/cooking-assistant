import React from "react";
import { useTranslation } from "react-i18next";

import { usePurchaseHistory } from "hooks/usePurchaseHistory";

import { PurchaseItem } from "components/ingredients/PurchaseItem";

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
        purchaseHistory,
        loading,
        error,
        handleQuantityChange,
        saveChange,
    } = usePurchaseHistory(ingredientId);

    const isEmpty = !loading && !error && purchaseHistory.length === 0;
    const hasHistory = !loading && !error && purchaseHistory.length > 0;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">
                    {t("purchaseModal.title", { name: ingredientName })}
                </h2>
                {loading && <p>{t("purchaseModal.loading")}</p>}
                {error && <p className="text-red-500">{error}</p>}
                {isEmpty && <p>{t("purchaseModal.noHistory")}</p>}
                {hasHistory && (
                    <ul className="space-y-2">
                        {purchaseHistory.map((purchase) => (
                            <PurchaseItem
                                key={purchase.id}
                                purchase={purchase}
                                language={i18n.language}
                                onQuantityChange={handleQuantityChange}
                                onSave={saveChange}
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
            </div>
        </div>
    );
};
