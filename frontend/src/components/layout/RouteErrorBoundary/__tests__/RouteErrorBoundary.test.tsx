import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RouteErrorBoundary } from "components/layout/RouteErrorBoundary";

import { renderWithRouter } from "test/router";

describe("RouteErrorBoundary", () => {
    it("should render a generic error message with a retry and a home link", () => {
        renderWithRouter(<RouteErrorBoundary onRetry={jest.fn()} />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(
            screen.getByText(/An unexpected error interrupted this page/),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Go to homepage" }),
        ).toHaveAttribute("href", "/");
    });

    it("should call onRetry when the retry button is clicked", async () => {
        const onRetry = jest.fn();

        renderWithRouter(<RouteErrorBoundary onRetry={onRetry} />);
        await userEvent.click(
            screen.getByRole("button", { name: "Try again" }),
        );

        expect(onRetry).toHaveBeenCalledTimes(1);
    });
});
