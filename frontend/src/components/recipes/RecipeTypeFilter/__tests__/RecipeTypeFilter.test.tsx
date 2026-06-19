import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RecipeTypeFilter } from "components/recipes/RecipeTypeFilter";

import { BTN_RESET_FILTERS } from "test/constants";

const TYPE_ID = 1;
const TYPE_NAME = "Soup";

const SAMPLE_TYPES = [{ id: TYPE_ID, type_name: TYPE_NAME, description: "" }];

describe("RecipeTypeFilter", () => {
    it("should show filter dropdown when button is clicked", async () => {
        render(
            <RecipeTypeFilter
                selectedTypes={[]}
                onChange={jest.fn()}
                types={SAMPLE_TYPES}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));

        expect(screen.getByText(TYPE_NAME)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: BTN_RESET_FILTERS }),
        ).toBeInTheDocument();
    });

    it("should call onChange when a type checkbox is toggled", async () => {
        const onChange = jest.fn();

        render(
            <RecipeTypeFilter
                selectedTypes={[]}
                onChange={onChange}
                types={SAMPLE_TYPES}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(screen.getByRole("checkbox"));

        expect(onChange).toHaveBeenCalledWith([TYPE_ID]);
    });
});
