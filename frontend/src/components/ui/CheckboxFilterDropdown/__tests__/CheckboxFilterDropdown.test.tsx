import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckboxFilterDropdown } from "components/ui/CheckboxFilterDropdown";

interface Item {
    id: number;
    name: string;
}

const ITEMS: Item[] = [
    { id: 1, name: "Soup" },
    { id: 2, name: "Dessert" },
];

const renderDropdown = (selected: number[], onChange = jest.fn()) =>
    render(
        <CheckboxFilterDropdown
            items={ITEMS}
            selected={selected}
            onChange={onChange}
            getKey={(item) => item.id}
            getLabel={(item) => item.name}
            buttonLabel="Filter"
            resetLabel="Reset filters"
        />,
    );

describe("CheckboxFilterDropdown", () => {
    it("should reveal the options when the filter button is clicked", async () => {
        renderDropdown([]);

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));

        expect(screen.getByText("Soup")).toBeInTheDocument();
        expect(screen.getByText("Dessert")).toBeInTheDocument();
    });

    it("should add an unselected option to the selection when toggled", async () => {
        const onChange = jest.fn();

        renderDropdown([], onChange);

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(screen.getAllByRole("checkbox")[0]);

        expect(onChange).toHaveBeenCalledWith([1]);
    });

    it("should remove an already-selected option when toggled", async () => {
        const onChange = jest.fn();

        renderDropdown([1], onChange);

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(screen.getAllByRole("checkbox")[0]);

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it("should clear the selection when reset is clicked", async () => {
        const onChange = jest.fn();

        renderDropdown([1, 2], onChange);

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(
            screen.getByRole("button", { name: "Reset filters" }),
        );

        expect(onChange).toHaveBeenCalledWith([]);
    });
});
