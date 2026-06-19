import { render, screen } from "@testing-library/react";

import { ServingsField } from "components/recipes/ServingsField";

describe("ServingsField", () => {
    it("should render label and input with correct value", () => {
        render(
            <ServingsField
                id="servings"
                label="Servings"
                placeholder="For example, 1 serving"
                value="2"
                onChange={jest.fn()}
            />,
        );

        expect(screen.getByLabelText("Servings")).toHaveValue("2");
    });
});
