import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CookingTimeInput } from "components/recipes/CookingTimeInput";

import { LABEL_COOKING_TIME } from "test/constants";

const setup = (value = "") => {
    const onChange = jest.fn();

    render(
        <CookingTimeInput
            id="cooking-time"
            label={LABEL_COOKING_TIME}
            value={value}
            onChange={onChange}
            placeholder="min"
            min="0"
        />,
    );

    return { onChange };
};

describe("CookingTimeInput", () => {
    it("should render the label and input with the given value", () => {
        setup("30");

        expect(screen.getByLabelText(LABEL_COOKING_TIME)).toHaveValue(30);
    });

    it("should call onChange with the typed value", async () => {
        const { onChange } = setup();

        await userEvent.type(screen.getByLabelText(LABEL_COOKING_TIME), "5");

        expect(onChange).toHaveBeenCalledWith("5");
    });

    it("should prevent typing + and - characters", async () => {
        const { onChange } = setup();

        await userEvent.type(screen.getByLabelText(LABEL_COOKING_TIME), "+-");

        expect(onChange).not.toHaveBeenCalled();
    });

    it("should strip non-digit characters before reporting the value", () => {
        const { onChange } = setup();

        // "1.5" is a valid number-input value, so the onInput handler is what
        // removes the "." before onChange reports the digits-only value upward
        fireEvent.input(screen.getByLabelText(LABEL_COOKING_TIME), {
            target: { value: "1.5" },
        });

        expect(onChange).toHaveBeenCalledWith("15");
    });
});
