import { LogOut } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

import { useGetMeQuery } from "redux/services/authApi";

import { useEscapeKey } from "hooks/useEscapeKey";
import { useLogoutModal } from "hooks/useLogoutModal";
import { useScrollLock } from "hooks/useScrollLock";

import { MainNav } from "components/layout/MainNav";
import { Avatar } from "components/ui/Avatar";
import { ThemeToggle } from "components/ui/ThemeToggle";

import { getInitials } from "utils/getInitials";

import styles from "./MobileNavDrawer.module.scss";

interface MobileNavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
    isOpen,
    onClose,
}) => {
    const { t } = useTranslation();
    const openLogoutModal = useLogoutModal();
    const { data: currentUser } = useGetMeQuery(null);
    const initials =
        currentUser?.name && currentUser.surname
            ? getInitials(currentUser.name, currentUser.surname)
            : undefined;

    useEscapeKey(onClose, isOpen);
    useScrollLock(isOpen);

    const handleLogoutClick = () => {
        onClose();
        openLogoutModal();
    };

    const overlayClass = [
        styles["mobile-nav-drawer__overlay"],
        isOpen && styles["mobile-nav-drawer__overlay--open"],
    ]
        .filter(Boolean)
        .join(" ");
    const asideClass = [
        styles["mobile-nav-drawer__panel"],
        isOpen && styles["mobile-nav-drawer__panel--open"],
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            <div
                role="presentation"
                onClick={onClose}
                className={overlayClass}
            />
            <aside className={asideClass}>
                <div className={styles["mobile-nav-drawer__profile"]}>
                    <Avatar size={46} initials={initials} />
                    <span>
                        {currentUser?.name && currentUser.surname
                            ? `${currentUser.name} ${currentUser.surname}`
                            : t("nav.accountPlaceholder")}
                    </span>
                </div>
                <div className={styles["mobile-nav-drawer__nav"]}>
                    <MainNav variant="drawer" onNavigate={onClose} />
                </div>
                <div className={styles["mobile-nav-drawer__footer"]}>
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={handleLogoutClick}
                        className={styles["mobile-nav-drawer__logout"]}
                    >
                        <LogOut size={19} aria-hidden="true" />
                        <span>{t("nav.logout")}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
