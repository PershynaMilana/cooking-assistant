import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToggleButtonGroup } from "components/ui/ToggleButtonGroup";

interface Item {
    id: number;
    name: string;
}

const ITEMS: Item[] = [
    { id: 1, name: "Egg" },
    { id: 2, name: "Milk" },
];

const baseProps = {
    label: "Ingredients",
    items: ITEMS,
    getKey: (item: Item) => item.id,
    getLabel: (item: Item) => item.name,
    selectedClassName: "selected",
    unselectedClassName: "unselected",
};

describe("ToggleButtonGroup", () => {
    it("should render the label and a button per item", () => {
        render(
            <ToggleButtonGroup
                {...baseProps}
                selectedIds={[]}
                onToggle={jest.fn()}
            />,
        );

        expect(screen.getByText("Ingredients")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Egg" })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Milk" }),
        ).toBeInTheDocument();
    });

    it("should call onToggle with the clicked item", async () => {
        const onToggle = jest.fn();

        render(
            <ToggleButtonGroup
                {...baseProps}
                selectedIds={[]}
                onToggle={onToggle}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Egg" }));

        expect(onToggle).toHaveBeenCalledWith(ITEMS[0]);
    });

    it("should render the error message when provided", () => {
        render(
            <ToggleButtonGroup
                {...baseProps}
                selectedIds={[]}
                onToggle={jest.fn()}
                errorMessage="Pick at least one"
            />,
        );

        expect(screen.getByText("Pick at least one")).toBeInTheDocument();
    });
});
