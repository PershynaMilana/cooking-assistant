import { screen } from "@testing-library/react";

import { ListPageLayout } from "components/layout/ListPageLayout";

import { renderWithProviders } from "test/router";

const FILTERS = "filters";
const CARD = "card";

const renderLayout = (props: { isEmpty: boolean; error: string | null }) =>
    renderWithProviders(
        <ListPageLayout
            filterSlot={<div>{FILTERS}</div>}
            heading="All Recipes"
            isEmpty={props.isEmpty}
            emptyMessage="Nothing here"
            error={props.error}
        >
            <div>{CARD}</div>
        </ListPageLayout>,
    );

describe("ListPageLayout", () => {
    it("should render the filter slot, heading and grid items when not empty", () => {
        renderLayout({ isEmpty: false, error: null });

        expect(screen.getByText("filters")).toBeInTheDocument();
        expect(screen.getByText("All Recipes")).toBeInTheDocument();
        expect(screen.getByText("card")).toBeInTheDocument();
    });

    it("should render the empty message instead of the grid when empty", () => {
        renderLayout({ isEmpty: true, error: null });

        expect(screen.getByText("Nothing here")).toBeInTheDocument();
        expect(screen.queryByText("card")).not.toBeInTheDocument();
    });

    it("should render the error message when an error is present", () => {
        renderLayout({ isEmpty: false, error: "Boom" });

        expect(screen.getByText("Boom")).toBeInTheDocument();
    });
});
