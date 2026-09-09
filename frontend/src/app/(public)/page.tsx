import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";

import { logger } from "config/logger";
import { ROUTES } from "constants/routes";
import type { CurrentUser } from "types/auth";

import { API_ROUTES } from "api/endpoints";
import { fetchAsVisitor } from "api/server";

import { HomeRoute } from "components/layout/HomeRoute";

import { GuestLandingView } from "./GuestLandingView";
import { HomeDashboardView } from "./HomeDashboardView";

// canonical is a per-route fact: the root layout deliberately sets none, so each route carries its own
export const metadata: Metadata = { alternates: { canonical: ROUTES.home } };

const SESSION = {
    authed: "authed",
    guest: "guest",
    unknown: "unknown",
} as const;

type Session = (typeof SESSION)[keyof typeof SESSION];

// "unknown" is not "guest": an API that did not answer says nothing about who is asking
const loadSession = async (): Promise<Session> => {
    try {
        const currentUser = await fetchAsVisitor<CurrentUser>(
            API_ROUTES.auth.me,
        );

        return currentUser ? SESSION.authed : SESSION.guest;
    } catch (error) {
        // reading the cookie is also how Next signals that this route must render dynamically -
        // swallowing that signal would break the route rather than degrade it
        unstable_rethrow(error);
        logger.error(error);

        return SESSION.unknown;
    }
};

// "/" is the one route whose content depends on the session, not just its chrome - deciding
// that here is what removes the flash of the wrong page a client-side check always had
const HomePage = async () => {
    const session = await loadSession();

    // the API was unreachable: hand the decision back to the browser, the way this route made
    // it before it was server-rendered, rather than showing a signed-in visitor the landing
    // page until they think to reload
    if (session === SESSION.unknown) {
        return (
            <HomeRoute
                authedElement={<HomeDashboardView />}
                guestElement={<GuestLandingView />}
            />
        );
    }

    return session === SESSION.authed ? (
        <HomeDashboardView />
    ) : (
        <GuestLandingView />
    );
};

export default HomePage;
