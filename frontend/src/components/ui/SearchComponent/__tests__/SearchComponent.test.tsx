import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchComponent } from "components/ui/SearchComponent";

import { renderWithRouter } from "test/router";

const PLACEHOLDER = "ingredient";
const QUERY = "egg";

describe("SearchComponent", () => {
    it("should show the reset button after typing a search term", async () => {
        renderWithRouter(<SearchComponent placeholder={PLACEHOLDER} />, [
            "/menu",
        ]);

        const input = screen.getByPlaceholderText(`Search by ${PLACEHOLDER}`);

        await userEvent.type(input, QUERY);

        expect(input).toHaveValue(QUERY);
        expect(
            screen.getByRole("button", { name: "Reset Search" }),
        ).toBeInTheDocument();
    });
});
