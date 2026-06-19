import { render, screen } from "@testing-library/react";

import { MissingIngredientsList } from "components/menu/MissingIngredientsList";

describe("MissingIngredientsList", () => {
    it("should render the section heading and each missing ingredient", () => {
        render(
            <MissingIngredientsList
                ingredients={{ Tomato: { quantity: 2, unit: "kg" } }}
            />,
        );

        expect(screen.getByText("Missing ingredients:")).toBeInTheDocument();
        expect(screen.getByText(/Tomato/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
        expect(screen.getByText(/kg/)).toBeInTheDocument();
    });

    it("should render with empty ingredients", () => {
        render(<MissingIngredientsList ingredients={{}} />);

        expect(screen.getByText("Missing ingredients:")).toBeInTheDocument();
    });
});
