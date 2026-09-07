import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";

import type { AppStore } from "redux/store";

import { NavigationBlockerProvider } from "components/layout/NavigationBlocker";

import { setTestLocation } from "test/nextNavigationMock";
import { makeTestStore } from "test/store";

export { mockNavigate, setTestParams } from "test/nextNavigationMock";

interface RenderOptions {
    // neutral non-root default: avoids coupling tests to whatever page currently lives at "/"
    initialEntries?: string[];
    store?: AppStore;
}

// use when a test needs the store (seed preloadedState / assert dispatched effects); the
// navigation blocker is part of the app-wide providers, so guarded links and forms behave here too
export const renderWithProviders = (
    ui: ReactElement,
    { initialEntries = ["/test"], store = makeTestStore() }: RenderOptions = {},
) => {
    setTestLocation(initialEntries[0]);

    const view = render(
        <Provider store={store}>
            <NavigationBlockerProvider>{ui}</NavigationBlockerProvider>
        </Provider>,
    );

    return { store, ...view };
};

// accepts either (ui) or (ui, initialEntries)
export const renderWithRouter = (
    ui: ReactElement,
    initialEntries: string[] = ["/test"],
) => renderWithProviders(ui, { initialEntries });
