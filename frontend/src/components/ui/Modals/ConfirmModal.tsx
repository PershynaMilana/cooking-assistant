import React from "react";
import { useTranslation } from "react-i18next";

import { BaseModal } from "components/ui/Modals/BaseModal";

const VARIANT_CLASSNAMES = {
    danger: "bg-red-500 text-white",
    primary: "bg-dark-purple text-white",
} as const;

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    isConfirmDisabled?: boolean;
    confirmVariant?: keyof typeof VARIANT_CLASSNAMES;
    error?: string | null;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    title,
    message,
    onConfirm,
    onClose,
    confirmLabel,
    cancelLabel,
    isConfirmDisabled,
    confirmVariant = "danger",
    error,
}) => {
    const { t } = useTranslation();

    return (
        <BaseModal title={title} onClose={onClose}>
            <p className="mb-6 text-center">{message}</p>
            {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onClose}
                    className="bg-gray-400 text-white px-4 py-2 rounded-full"
                >
                    {cancelLabel ?? t("modal.cancel")}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isConfirmDisabled}
                    className={`px-4 py-2 rounded-full disabled:opacity-50 ${VARIANT_CLASSNAMES[confirmVariant]}`}
                >
                    {confirmLabel ?? t("modal.confirm")}
                </button>
            </div>
        </BaseModal>
    );
};
