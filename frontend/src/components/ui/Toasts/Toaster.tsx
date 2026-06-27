import { useAppSelector } from "redux/hooks";
import { selectNotifications } from "redux/selectors/notificationsSelectors";

import { Toast } from "components/ui/Toasts/Toast";

export const Toaster = () => {
    const notifications = useAppSelector(selectNotifications);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((notification) => (
                <Toast key={notification.id} notification={notification} />
            ))}
        </div>
    );
};
