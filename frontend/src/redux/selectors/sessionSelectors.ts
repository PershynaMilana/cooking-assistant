import type { RootState } from "redux/store";

export const selectSessionStatus = (state: RootState) => state.session.status;
export const selectIsAuthed = (state: RootState) =>
    state.session.status === "authed";
export const selectIsChecking = (state: RootState) =>
    state.session.status === "checking";
export const selectHasSessionError = (state: RootState) =>
    state.session.status === "error";
