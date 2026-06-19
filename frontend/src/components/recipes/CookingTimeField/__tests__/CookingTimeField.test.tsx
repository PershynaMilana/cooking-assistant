import { render, screen } from "@testing-library/react";

import { CookingTimeField } from "components/recipes/CookingTimeField";

import { ERROR_COOKING_TIME_FORMAT, LABEL_COOKING_TIME } from "test/constants";

describe("CookingTimeField", () => {
    it("should render label, input and no error when error is null", () => {
        render(
            <CookingTimeField
                id="cooking-time"
                label={LABEL_COOKING_TIME}
                value="1:30"
                error={null}
                onChange={jest.fn()}
            />,
        );

        expect(screen.getByLabelText(LABEL_COOKING_TIME)).toHaveValue("1:30");
        expect(screen.queryByText(/error/)).toBeNull();
    });

    it("should render error message when provided", () => {
        render(
            <CookingTimeField
                id="cooking-time"
                label={LABEL_COOKING_TIME}
                value=""
                error={ERROR_COOKING_TIME_FORMAT}
                onChange={jest.fn()}
            />,
        );

        expect(screen.getByText(ERROR_COOKING_TIME_FORMAT)).toBeInTheDocument();
    });
});
