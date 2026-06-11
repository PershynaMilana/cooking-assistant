import { z } from "zod";

import { nonEmptyStringSchema, optionalStringSchema } from "./common.schemas";

export const recipeTypeSchema = z.object({
    type_name: nonEmptyStringSchema("Type name"),
    description: optionalStringSchema("Description"),
});
