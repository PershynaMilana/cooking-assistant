import type { RootState } from "redux/store";
import { setupStore } from "redux/store";

// fresh store per test; pass preloadedState to seed slices (session, ui, ...)
export const makeTestStore = (preloadedState?: Partial<RootState>) =>
    setupStore(preloadedState);
