import type { LucideIcon } from "lucide-react";
import { BarChart3, BookOpen, Carrot, FolderOpen, Layers } from "lucide-react";

import { ROUTES } from "./routes";

export interface NavItem {
    to: string;
    labelKey: string;
    Icon: LucideIcon;
}

// primary browse nav shared by the desktop top bar and the mobile drawer;
// "Types" is intentionally not here (filtered by type elsewhere instead)
export const NAV_ITEMS: NavItem[] = [
    { to: ROUTES.allRecipes, labelKey: "nav.recipes", Icon: BookOpen },
    { to: ROUTES.menus, labelKey: "nav.menus", Icon: Layers },
    { to: ROUTES.myMenus, labelKey: "nav.myMenus", Icon: FolderOpen },
    { to: ROUTES.ingredients, labelKey: "nav.ingredients", Icon: Carrot },
    { to: ROUTES.stats, labelKey: "nav.stats", Icon: BarChart3 },
];
