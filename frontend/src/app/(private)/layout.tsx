import type { ReactNode } from "react";

import { PrivateRoute } from "components/layout/PrivateRoute";

interface PrivateLayoutProps {
    children: ReactNode;
}

// the route group is the privacy boundary: a page under it cannot forget its own guard
const PrivateLayout = ({ children }: PrivateLayoutProps) => (
    <PrivateRoute>{children}</PrivateRoute>
);

export default PrivateLayout;
