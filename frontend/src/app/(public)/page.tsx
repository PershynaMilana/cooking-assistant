import type { Metadata } from "next";

import { HomeRoute } from "components/layout/HomeRoute";

import GuestLandingPage from "views/home/GuestLandingPage";
import HomePage from "views/home/HomePage";

// canonical is a per-route fact: the root layout deliberately sets none, so each route carries its own
export const metadata: Metadata = { alternates: { canonical: "/" } };

// "/" is the one route whose content depends on the session, not just its chrome
const Home = () => (
    <HomeRoute
        authedElement={<HomePage />}
        guestElement={<GuestLandingPage />}
    />
);

export default Home;
