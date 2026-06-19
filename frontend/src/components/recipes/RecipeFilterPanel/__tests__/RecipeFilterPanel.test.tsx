import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RecipeFilterState } from "hooks/useRecipeFilters";

import { RecipeFilterPanel } from "components/recipes/RecipeFilterPanel";

import { renderWithRouter } from "test/router";

const BASE_FILTERS: RecipeFilterState = {
    selectedTypes: [],
    startDate: "",
    endDate: "",
    minCookingTime: "",
    maxCookingTime: "",
    sortOrder: "asc",
    ingredientName: null,
};

const setup = (overrides: Partial<RecipeFilterState> = {}) => {
    const setSortOrder = jest.fn();

    renderWithRouter(
        <RecipeFilterPanel
            filters={{ ...BASE_FILTERS, ...overrides }}
            setSelectedTypes={jest.fn()}
            setStartDate={jest.fn()}
            setEndDate={jest.fn()}
            setMinCookingTime={jest.fn()}
            setMaxCookingTime={jest.fn()}
            setSortOrder={setSortOrder}
            types={[]}
            searchPlaceholder="Search recipes"
        />,
    );

    return { setSortOrder };
};

describe("RecipeFilterPanel", () => {
    it("should render the search input with the given placeholder", () => {
        setup();

        expect(
            screen.getByPlaceholderText(/search recipes/i),
        ).toBeInTheDocument();
    });

    it("should reflect the current sortOrder in the select", () => {
        setup({ sortOrder: "desc" });

        expect(screen.getByRole("combobox")).toHaveValue("desc");
    });

    it("should call setSortOrder when the sort select changes", async () => {
        const { setSortOrder } = setup({ sortOrder: "asc" });

        await userEvent.selectOptions(screen.getByRole("combobox"), "desc");

        expect(setSortOrder).toHaveBeenCalledWith("desc");
    });

    it("should render both sort options", () => {
        setup();

        const select = screen.getByRole("combobox");

        expect(select).toContainElement(
            screen.getByRole("option", { name: /fast to long/i }),
        );
        expect(select).toContainElement(
            screen.getByRole("option", { name: /long to fast/i }),
        );
    });
});
