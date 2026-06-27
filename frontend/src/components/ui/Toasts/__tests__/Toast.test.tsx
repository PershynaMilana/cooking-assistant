import { screen } from "@testing-library/react";

import type {
    Notification,
    NotificationType,
} from "redux/slices/notificationsSlice";

import { Toast } from "components/ui/Toasts/Toast";

import { renderWithProviders } from "test/router";

const TYPE_CLASSNAMES: Record<NotificationType, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-gray-800",
};

const makeNotification = (type: NotificationType): Notification => ({
    id: "n1",
    type,
    message: "Boom",
});

describe("Toast", () => {
    it.each(Object.entries(TYPE_CLASSNAMES))(
        "should apply the %s variant class",
        (type, className) => {
            renderWithProviders(
                <Toast
                    notification={makeNotification(type as NotificationType)}
                />,
            );

            expect(screen.getByText("Boom")).toHaveClass(className);
        },
    );
});
