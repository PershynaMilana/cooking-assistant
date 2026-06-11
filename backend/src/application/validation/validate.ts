import { z } from "zod";

import { ValidationError } from "@domain/errors/AppError";

export function validate<TSchema extends z.ZodTypeAny>(
    schema: TSchema,
    data: unknown,
): z.infer<TSchema> {
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
