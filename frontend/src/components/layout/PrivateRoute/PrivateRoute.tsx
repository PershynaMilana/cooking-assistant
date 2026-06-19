import type { ReactNode } from "react";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "constants/routes";
import { AUTH_TOKEN_KEY } from "constants/storage";

interface PrivateRouteProps {
    // optional: when used as a layout route (no children) it renders an <Outlet/>
    children?: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
        return <Navigate to={ROUTES.login} replace />;
    }

    return <>{children ?? <Outlet />}</>;
};
