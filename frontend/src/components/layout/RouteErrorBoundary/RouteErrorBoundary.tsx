"use client";

import React from "react";
import { useTranslation } from "react-i18next";

import { ROUTES } from "constants/routes";

import { ErrorState } from "components/ui/ErrorState";
import { Link } from "components/ui/Link";

import styles from "./RouteErrorBoundary.module.scss";

interface RouteErrorBoundaryProps {
    onRetry: () => void;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
    onRetry,
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles["route-error-boundary"]}>
            <ErrorState
                title={t("errorState.title")}
                description={t("routeError.description")}
                onRetry={onRetry}
                retryLabel={t("errorState.retry")}
            />
            <Link
                href={ROUTES.home}
                className={styles["route-error-boundary__home"]}
            >
                {t("routeError.goHome")}
            </Link>
        </div>
    );
};
