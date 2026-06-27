import { useEffect } from "react";

import { useAppDispatch } from "redux/hooks";
import type { Notification } from "redux/slices/notificationsSlice";
import { removeNotification } from "redux/slices/notificationsSlice";

const AUTO_DISMISS_MS = 4000;

const TYPE_CLASSNAMES: Record<Notification["type"], string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-gray-800",
};

export const Toast = ({ notification }: { notification: Notification }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeNotification(notification.id));
        }, AUTO_DISMISS_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [dispatch, notification.id]);

    return (
        <button
            type="button"
            onClick={() => dispatch(removeNotification(notification.id))}
            className={`${TYPE_CLASSNAMES[notification.type]} rounded px-4 py-2 text-left text-white shadow`}
        >
            {notification.message}
        </button>
    );
};
