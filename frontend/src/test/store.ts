import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";
import { Provider } from "react-redux";

import type { AppStore, RootState } from "redux/store";
import { setupStore } from "redux/store";

import { NavigationBlockerProvider } from "components/layout/NavigationBlocker";

import { setTestLocation } from "test/nextNavigationMock";

// fresh store per test; pass preloadedState to seed slices (session, ui, ...)
export const makeTestStore = (preloadedState?: Partial<RootState>) =>
    setupStore(preloadedState);

// the navigation blocker is app-wide in production, so every hook that navigates sees it here too
const makeWrapper = (store: AppStore) =>
    function Wrapper({ children }: { children: ReactNode }) {
        return React.createElement(Provider, {
            store,
            children: React.createElement(
                NavigationBlockerProvider,
                null,
                children,
            ),
        });
    };

// renders a hook behind a real Redux Provider and returns the store alongside the render result
export const renderHookWithStore = <T>(
    callback: () => T,
    store: AppStore = makeTestStore(),
) => ({ ...renderHook(callback, { wrapper: makeWrapper(store) }), store });

interface RenderHookWithRouterOptions {
    store?: AppStore;
    initialEntries?: string[];
}

// same as renderHookWithStore, but seeds the URL first, so hooks built on useSearchParams
// (e.g. useListFilters) read and write real URL state
export const renderHookWithRouter = <T>(
    callback: () => T,
    {
        store = makeTestStore(),
        initialEntries = ["/test"],
    }: RenderHookWithRouterOptions = {},
) => {
    setTestLocation(initialEntries[0]);

    return renderHookWithStore(callback, store);
};
