import {
    checkSession,
    loggedOut,
    sessionReducer,
} from "redux/slices/sessionSlice";

describe("sessionSlice", () => {
    it("should start in the checking status", () => {
        const state = sessionReducer(undefined, { type: "@@INIT" });

        expect(state.status).toBe("checking");
    });

    it("should set the status to unauthed on loggedOut from authed", () => {
        const state = sessionReducer({ status: "authed" }, loggedOut());

        expect(state.status).toBe("unauthed");
    });

    it("should set the status to unauthed on loggedOut from checking", () => {
        const state = sessionReducer({ status: "checking" }, loggedOut());

        expect(state.status).toBe("unauthed");
    });

    it("should set the status to unauthed on loggedOut from error", () => {
        const state = sessionReducer({ status: "error" }, loggedOut());

        expect(state.status).toBe("unauthed");
    });

    it("should set the status to checking while the session check is pending", () => {
        const state = sessionReducer(
            { status: "unauthed" },
            checkSession.pending("", undefined),
        );

        expect(state.status).toBe("checking");
    });

    it("should set the status to checking when a new session check starts from authed", () => {
        const state = sessionReducer(
            { status: "authed" },
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

    it("should set the status to error when the session check is rejected", () => {
        const state = sessionReducer(
            { status: "checking" },
            checkSession.rejected(new Error("network error"), "", undefined),
        );

        expect(state.status).toBe("error");
    });

    it("should set the status to error when the session check is rejected from unauthed", () => {
        const state = sessionReducer(
            { status: "unauthed" },
            checkSession.rejected(new Error("network error"), "", undefined),
        );

        expect(state.status).toBe("error");
    });
});
