import type { CurrentUser } from "types/auth";

import { fetchAsVisitor } from "api/server";

import { HomeRoute } from "components/layout/HomeRoute";

import { GuestLandingView } from "app/(public)/GuestLandingView";
import { HomeDashboardView } from "app/(public)/HomeDashboardView";
import HomePage from "app/(public)/page";

jest.mock("api/server", () => ({ fetchAsVisitor: jest.fn() }));

const mockedFetch = fetchAsVisitor as jest.MockedFunction<
    typeof fetchAsVisitor
>;

const USER = { id: 1, login: "claude" } as CurrentUser;

describe("home page", () => {
    it("should render the dashboard for a visitor with a session", async () => {
        mockedFetch.mockResolvedValue(USER);

        expect((await HomePage()).type).toBe(HomeDashboardView);
    });

    it("should render the landing for a visitor without one", async () => {
        mockedFetch.mockResolvedValue(null);

        expect((await HomePage()).type).toBe(GuestLandingView);
    });

    it("should let the browser decide when the api never answered", async () => {
        mockedFetch.mockRejectedValue(new Error("boom"));

        expect((await HomePage()).type).toBe(HomeRoute);
    });
});
