import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import NotFoundPage from "pages/not-found/NotFoundPage";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("NotFoundPage", () => {
    it("should navigate home when the homepage button is clicked", async () => {
        renderWithRouter(<NotFoundPage />);

        expect(screen.getByText("Oops....")).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: "GO TO HOMEPAGE" }),
        );

        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});
