import type { ReactNode } from "react";
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
