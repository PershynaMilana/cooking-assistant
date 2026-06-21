import type { z } from "zod";

import { ValidationError } from "domain/errors/AppError";

export function validate<Output, Input>(
    schema: z.ZodType<Output, z.ZodTypeDef, Input>,
    data: unknown,
): Output {
    const result = schema.safeParse(data);

    if (!result.success) {
        const message = result.error.issues
            .map((issue) =>
                issue.path.length
                    ? `${issue.path.join(".")}: ${issue.message}`
                    : issue.message,
            )
            .join("; ");

        throw new ValidationError(message);
    }

    return result.data;
}
