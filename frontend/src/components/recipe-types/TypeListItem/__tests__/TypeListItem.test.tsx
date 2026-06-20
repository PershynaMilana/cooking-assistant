import { render, screen } from "@testing-library/react";

import { TypeListItem } from "components/recipe-types/TypeListItem";

const TYPE = { id: 1, type_name: "Soup", description: "warm" };

describe("TypeListItem", () => {
    it("should render the type name", () => {
        render(
            <ul>
                <TypeListItem type={TYPE} />
            </ul>,
        );

        expect(screen.getByText("Soup")).toBeInTheDocument();
    });

    it("should not render edit or delete controls", () => {
        render(
            <ul>
                <TypeListItem type={TYPE} />
            </ul>,
        );

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
