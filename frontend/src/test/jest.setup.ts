import "@testing-library/jest-dom";
// initialize the shared i18n instance so components using useTranslation()
// render real English strings in tests (no provider needed - global instance)
import "i18n/index";

// keep tests isolated from each other's auth-token / pantry state
afterEach(() => {
    localStorage.clear();
});
