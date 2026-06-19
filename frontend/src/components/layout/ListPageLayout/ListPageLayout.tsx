import React from "react";

import { Header } from "components/layout/Header";

interface ListPageLayoutProps {
    // filter/search controls rendered above the heading
    filterSlot: React.ReactNode;
    // optional call-to-action (e.g. an "Add" link) between filters and heading
    actionSlot?: React.ReactNode;
    heading: string;
    // optional content between the heading and the grid (e.g. type descriptions)
    afterHeading?: React.ReactNode;
    isEmpty: boolean;
    emptyMessage: string;
    error: string | null;
    // the card grid items
    children: React.ReactNode;
}

// shared shell for the recipe and menu list pages: Header, filter row, heading, a
// responsive card grid (or an empty message) and an error line. Domain list views
// are thin adapters that fill the slots with their own filters and cards.
export const ListPageLayout: React.FC<ListPageLayoutProps> = ({
    filterSlot,
    actionSlot,
    heading,
    afterHeading,
    isEmpty,
    emptyMessage,
    error,
    children,
}) => (
    <div>
        <Header />
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

            {error && <div className="text-red-500 mb-4">{error}</div>}
        </div>
    </div>
);
