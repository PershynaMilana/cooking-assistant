import { Bell, X } from "lucide-react";
import React, { useId } from "react";
import { useTranslation } from "react-i18next";

import { useEscapeKey } from "hooks/useEscapeKey";
import { useScrollLock } from "hooks/useScrollLock";

import styles from "./NewsModal.module.scss";

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// static placeholder content - there is no news feed/backend yet (seed only)
const NEWS_ITEM_KEYS = ["ratings", "expiry", "cards"] as const;
const ICON_SIZE = 20;
const CLOSE_ICON_SIZE = 16;

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation("home");
    const titleId = useId();

    useEscapeKey(onClose, isOpen);
    useScrollLock(isOpen);

    if (!isOpen) {
        return null;
    }

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            role="presentation"
            onClick={handleOverlayClick}
            className={styles["news-modal__overlay"]}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={styles["news-modal"]}
            >
                <div className={styles["news-modal__header"]}>
                    <div className={styles["news-modal__heading"]}>
                        <span className={styles["news-modal__icon"]}>
                            <Bell size={ICON_SIZE} aria-hidden="true" />
                        </span>
                        <h3
                            id={titleId}
                            className={styles["news-modal__title"]}
                        >
                            {t("newsModal.title")}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("newsModal.close")}
                        className={styles["news-modal__close"]}
                    >
                        <X size={CLOSE_ICON_SIZE} aria-hidden="true" />
                    </button>
                </div>
                <div className={styles["news-modal__list"]}>
                    {NEWS_ITEM_KEYS.map((key) => (
                        <div key={key} className={styles["news-modal__item"]}>
                            <div className={styles["news-modal__date"]}>
                                {t(`newsModal.items.${key}.date`)}
                            </div>
                            <div className={styles["news-modal__item-title"]}>
                                {t(`newsModal.items.${key}.title`)}
                            </div>
                            <div className={styles["news-modal__description"]}>
                                {t(`newsModal.items.${key}.description`)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
