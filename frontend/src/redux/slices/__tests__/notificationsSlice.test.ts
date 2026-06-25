import {
    addNotification,
    notificationsReducer,
    removeNotification,
} from "redux/slices/notificationsSlice";

describe("notificationsSlice", () => {
    it("should start empty", () => {
        const state = notificationsReducer(undefined, { type: "@@INIT" });

        expect(state.items).toEqual([]);
    });

    it("should add a notification with a generated id", () => {
        const state = notificationsReducer(
            undefined,
            addNotification({ type: "success", message: "Saved" }),
        );

        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toMatchObject({
            type: "success",
            message: "Saved",
        });
        expect(state.items[0].id.length).toBeGreaterThan(0);
    });

    it("should remove a notification by id", () => {
        const start = {
            items: [
                { id: "a", type: "info" as const, message: "x" },
                { id: "b", type: "info" as const, message: "y" },
            ],
        };

        const state = notificationsReducer(start, removeNotification("a"));

        expect(state.items).toEqual([{ id: "b", type: "info", message: "y" }]);
    });
});
