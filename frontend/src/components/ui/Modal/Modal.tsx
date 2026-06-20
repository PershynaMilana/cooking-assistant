import React from "react";
import { useTranslation } from "react-i18next";

interface ModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    error?: string | null;
    isConfirmDisabled?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    error,
    isConfirmDisabled,
}) => {
    const { t } = useTranslation();

    if (!isOpen) {
        return null;
    }

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            role="presentation"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold font-montserratRegular mb-4 text-center">
                    {title}
                </h2>{" "}
                <p className="mb-6 text-center">{message}</p>{" "}
                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </p>
                )}
                <div className="flex justify-center space-x-4">
                    {" "}
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded-full"
                    >
                        {t("modal.cancel")}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isConfirmDisabled}
                        className="bg-red-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    >
                        {t("modal.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};
