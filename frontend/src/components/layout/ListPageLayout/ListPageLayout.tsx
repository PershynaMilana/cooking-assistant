import React from "react";

import { AppShell } from "components/layout/AppShell";

interface ListPageLayoutProps {
    filterSlot: React.ReactNode;
    actionSlot?: React.ReactNode;
    heading: string;
    afterHeading?: React.ReactNode;
    isEmpty: boolean;
    emptyMessage: string;
    error: string | null;
    footerSlot?: React.ReactNode;
    children: React.ReactNode;
}

export const ListPageLayout: React.FC<ListPageLayoutProps> = ({
    filterSlot,
    actionSlot,
    heading,
    afterHeading,
    isEmpty,
    emptyMessage,
    error,
    footerSlot,
    children,
}) => (
    <AppShell>
        <div className="mx-[15vw]">
            {filterSlot}

            {actionSlot}

            <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">
                {heading}
            </h1>

            {afterHeading}

            {isEmpty ? (
                <div className="text-center text-gray-600 mb-4">
                    {emptyMessage}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {children}
                </div>
            )}

            {footerSlot}

            {error && <div className="text-red-500 mb-4">{error}</div>}
        </div>
    </AppShell>
);
