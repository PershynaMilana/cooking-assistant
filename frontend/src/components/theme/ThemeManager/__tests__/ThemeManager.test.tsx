import { THEME_STORAGE_KEY } from "redux/slices/themeSlice";

import { ThemeManager } from "components/theme/ThemeManager";

import { renderWithProviders } from "test/router";
import { makeTestStore } from "test/store";

describe("ThemeManager", () => {
    it("should set the html data-theme attribute and persist the mode", () => {
        const store = makeTestStore({ theme: { mode: "light" } });

        renderWithProviders(<ThemeManager />, { store });

        expect(document.documentElement.dataset.theme).toBe("light");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    });

    it("should render nothing", () => {
        const { container } = renderWithProviders(<ThemeManager />, {
            store: makeTestStore({ theme: { mode: "dark" } }),
        });

        expect(container).toBeEmptyDOMElement();
    });
});
