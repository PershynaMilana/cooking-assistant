import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuCategoryFilter } from "components/menu/MenuCategoryFilter";

import { BTN_RESET_FILTERS } from "test/constants";

const CATEGORY_ID = 3;
const CATEGORY_NAME = "Lunch";
const CATEGORIES = [
    { menu_category_id: CATEGORY_ID, category_name: CATEGORY_NAME },
];

describe("MenuCategoryFilter", () => {
    it("should call onChange when a category is selected", async () => {
        const onChange = jest.fn();

        render(
            <MenuCategoryFilter
                categories={CATEGORIES}
                selectedCategories={[]}
                onChange={onChange}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(screen.getByRole("checkbox"));

        expect(onChange).toHaveBeenCalledWith([CATEGORY_ID]);
    });

    it("should remove category id from selection when checkbox is unchecked", async () => {
        const onChange = jest.fn();

        render(
            <MenuCategoryFilter
                categories={CATEGORIES}
                selectedCategories={[CATEGORY_ID]}
                onChange={onChange}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(screen.getByRole("checkbox"));

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it("should clear all selected categories when Reset is clicked", async () => {
        const onChange = jest.fn();

        render(
            <MenuCategoryFilter
                categories={CATEGORIES}
                selectedCategories={[CATEGORY_ID]}
                onChange={onChange}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(
            screen.getByRole("button", { name: BTN_RESET_FILTERS }),
        );

        expect(onChange).toHaveBeenCalledWith([]);
    });
});
