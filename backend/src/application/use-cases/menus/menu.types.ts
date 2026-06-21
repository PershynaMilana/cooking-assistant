import type { z } from "zod";

import type { MenuInput, MenuUpdateInput } from "domain/entities/Menu";

import type { menuFiltersSchema } from "application/validation/menu.schemas";

export type CreateMenuInput = MenuInput & { recipeIds: number[] };
export type UpdateMenuInput = MenuUpdateInput & { recipeIds: number[] };

export type MenuFilters = z.infer<typeof menuFiltersSchema>;
