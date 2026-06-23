import {
    checkSession,
    loggedOut,
    sessionReducer,
} from "store/slices/sessionSlice";

describe("sessionSlice", () => {
    it("should start in the checking status", () => {
        const state = sessionReducer(undefined, { type: "@@INIT" });

        expect(state.status).toBe("checking");
    });

    it("should set the status to unauthed on loggedOut", () => {
        const state = sessionReducer({ status: "authed" }, loggedOut());

        expect(state.status).toBe("unauthed");
    });

    it("should set the status to checking while the session check is pending", () => {
        const state = sessionReducer(
            { status: "unauthed" },
            checkSession.pending("", undefined),
        );

        expect(state.status).toBe("checking");
    });

    it("should set the status to authed when the session check is fulfilled", () => {
        const state = sessionReducer(
            { status: "checking" },
            checkSession.fulfilled(undefined, "", undefined),
        );

        expect(state.status).toBe("authed");
    });

    it("should set the status to unauthed when the session check is rejected", () => {
        const state = sessionReducer(
            { status: "checking" },
            checkSession.rejected(new Error("nope"), "", undefined),
        );

        expect(state.status).toBe("unauthed");
    });
});
