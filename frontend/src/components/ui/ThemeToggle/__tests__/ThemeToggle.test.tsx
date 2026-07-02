import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeToggle } from "components/ui/ThemeToggle";

import { renderWithProviders } from "test/router";
import { makeTestStore } from "test/store";

describe("ThemeToggle", () => {
    it("should show the moon icon and dark label in dark mode", () => {
        renderWithProviders(<ThemeToggle />, {
            store: makeTestStore({ theme: { mode: "dark" } }),
        });

        expect(screen.getByText("Dark")).toBeInTheDocument();
    });

    it("should show the sun icon and light label in light mode", () => {
        renderWithProviders(<ThemeToggle />, {
            store: makeTestStore({ theme: { mode: "light" } }),
        });

        expect(screen.getByText("Light")).toBeInTheDocument();
    });

    it("should toggle the theme when clicked", async () => {
        const store = makeTestStore({ theme: { mode: "dark" } });

        renderWithProviders(<ThemeToggle />, { store });

        await userEvent.click(
            screen.getByRole("button", { name: "Toggle theme" }),
        );

        expect(store.getState().theme.mode).toBe("light");
    });
});
