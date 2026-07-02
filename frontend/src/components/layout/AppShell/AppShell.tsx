import React from "react";

import { useDisclosure } from "hooks/useDisclosure";

import { AppHeader } from "components/layout/AppHeader";
import { MobileNavDrawer } from "components/layout/MobileNavDrawer";

import styles from "./AppShell.module.scss";

interface AppShellProps {
    children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const drawer = useDisclosure();

    return (
        <div className={styles["app-shell"]}>
            <AppHeader onOpenDrawer={drawer.open} />
            <MobileNavDrawer isOpen={drawer.isOpen} onClose={drawer.close} />
            <main className={styles["app-shell__main"]}>{children}</main>
        </div>
    );
};
