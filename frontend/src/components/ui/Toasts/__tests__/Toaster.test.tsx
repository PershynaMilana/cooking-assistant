import { act, fireEvent, screen } from "@testing-library/react";

import type { Notification } from "redux/slices/notificationsSlice";

import { Toaster } from "components/ui/Toasts/Toaster";

import { renderWithProviders } from "test/router";
import { makeTestStore } from "test/store";

const AUTO_DISMISS_MS = 4000;

const seeded = (message: string): { items: Notification[] } => ({
    items: [{ id: "n1", type: "error", message }],
});

describe("Toaster", () => {
    it("should render nothing when there are no notifications", () => {
        const { container } = renderWithProviders(<Toaster />, {
            store: makeTestStore(),
        });

        expect(container).toBeEmptyDOMElement();
    });

    it("should render a notification message", () => {
        renderWithProviders(<Toaster />, {
            store: makeTestStore({ notifications: seeded("Boom") }),
        });

        expect(screen.getByText("Boom")).toBeInTheDocument();
    });

    it("should dismiss a notification on click", () => {
        const store = makeTestStore({ notifications: seeded("Boom") });

        renderWithProviders(<Toaster />, { store });

        fireEvent.click(screen.getByText("Boom"));

        expect(store.getState().notifications.items).toHaveLength(0);
    });

    it("should auto-dismiss a notification after the timeout", () => {
        jest.useFakeTimers();
        const store = makeTestStore({ notifications: seeded("Boom") });

        try {
            renderWithProviders(<Toaster />, { store });

            act(() => {
                jest.advanceTimersByTime(AUTO_DISMISS_MS);
            });

            expect(store.getState().notifications.items).toHaveLength(0);
        } finally {
            jest.useRealTimers();
        }
    });
});
