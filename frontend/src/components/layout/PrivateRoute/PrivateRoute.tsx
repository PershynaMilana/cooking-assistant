import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { getMe } from "api/authApi";
import { isAxiosError } from "api/client";

type SessionState = "checking" | "authed" | "unauthed" | "error";

interface PrivateRouteProps {
    children?: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { t } = useTranslation();
    const [session, setSession] = useState<SessionState>("checking");

    useEffect(() => {
        getMe()
            .then(() => {
                setSession("authed");
            })
            .catch((err: unknown) => {
                const status = isAxiosError(err)
                    ? err.response?.status
                    : undefined;

                if (status === 401 || status === 403) {
                    setSession("unauthed");
                } else {
                    setSession("error");
                }
            });
    }, []);

    if (session === "checking") return <div className="min-h-screen" />;
    if (session === "unauthed") return <Navigate to={ROUTES.login} replace />;
    if (session === "error") return <div>{t("sessionError")}</div>;

    return <>{children ?? <Outlet />}</>;
};
