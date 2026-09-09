import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { menuDetailsPath } from "constants/routes";
import type { MenuDetails } from "types/menu";

import { API_ROUTES } from "api/endpoints";
import { fetchAsVisitor } from "api/server";

import { DEFAULT_LANGUAGE } from "i18n/resources";
import { getServerTranslation } from "i18n/server";

import { toMetaDescription } from "utils/metaDescription";

import { MenuDetailsView } from "./MenuDetailsView";

const NAMESPACE = "menu";

interface MenuPageProps {
    params: Promise<{ id: string }>;
}

// generateMetadata and the page itself both need the menu; cache() makes that one request
const loadMenu = cache(async (id: string): Promise<MenuDetails | null> =>
    fetchAsVisitor<MenuDetails>(API_ROUTES.menu.byId(id)),
);

export const generateMetadata = async ({
    params,
}: MenuPageProps): Promise<Metadata> => {
    const { id } = await params;
    const menu = await loadMenu(id);

    if (!menu) {
        return {};
    }

    const t = await getServerTranslation(DEFAULT_LANGUAGE, NAMESPACE);
    // the category column is nullable, so a menu can have none to name
    const fallbackKey =
        menu.menu.categoryname === null
            ? "menuDetailsPage.metaFallbackDescriptionUncategorised"
            : "menuDetailsPage.metaFallbackDescription";
    const description = toMetaDescription(
        menu.menu.menucontent,
        t(fallbackKey, {
            category: menu.menu.categoryname?.toLowerCase(),
            count: menu.recipes.length,
        }),
    );
    const url = menuDetailsPath(menu.menu.id);

    return {
        title: menu.menu.title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            url,
            title: menu.menu.title,
            description,
        },
        twitter: { title: menu.menu.title, description },
    };
};

const MenuDetailsPage = async ({ params }: MenuPageProps) => {
    const { id } = await params;
    const menu = await loadMenu(id);

    if (!menu) {
        notFound();
    }

    return <MenuDetailsView menu={menu} />;
};

export default MenuDetailsPage;
