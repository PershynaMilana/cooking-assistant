import "styles/global.scss";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { DEFAULT_LANGUAGE } from "i18n/resources";
import { getServerTranslation } from "i18n/server";

import { Providers } from "./providers";
import { themeInitScript } from "./themeInit";

const DEV_SITE_URL = "http://localhost:8080";
const ICON_PATH = "/favicon.svg";

// absolute URLs in metadata are resolved against this, so canonical and social tags
// follow the deployment. A production build without it would ship localhost URLs that
// nothing downstream would flag, so it fails the build instead.
const resolveSiteUrl = () => {
    const configured = process.env.NEXT_PUBLIC_SITE_URL;

    if (configured) {
        return configured;
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error(
            "NEXT_PUBLIC_SITE_URL must be set for a production build: canonical and social URLs resolve against it.",
        );
    }

    return DEV_SITE_URL;
};

// canonical and og:url are per-route facts and are set by each route: inherited here they
// would tell search engines every page is the same one
export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getServerTranslation();
    const title = t("appName");
    const description = t("meta.description");
    const shortDescription = t("meta.shortDescription");

    return {
        metadataBase: new URL(resolveSiteUrl()),
        title: { default: title, template: t("meta.titleTemplate") },
        description,
        icons: { icon: ICON_PATH },
        openGraph: {
            type: "website",
            siteName: title,
            title,
            description: shortDescription,
            images: [{ url: ICON_PATH, type: "image/svg+xml" }],
        },
        twitter: {
            card: "summary",
            title,
            description: shortDescription,
            images: [ICON_PATH],
        },
    };
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    colorScheme: "dark light",
    themeColor: process.env.THEME_COLOR_DARK,
};

interface RootLayoutProps {
    children: ReactNode;
}

// suppressHydrationWarning: the pre-paint script sets data-theme before React hydrates
const RootLayout = ({ children }: RootLayoutProps) => (
    <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        </head>
        <body>
            <Providers>{children}</Providers>
        </body>
    </html>
);

export default RootLayout;
