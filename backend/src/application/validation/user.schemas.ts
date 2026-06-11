import { z } from "zod";

import { nonEmptyStringSchema } from "./common.schemas";

export const registerUserSchema = z.object({
    name: nonEmptyStringSchema("Name"),
    surname: nonEmptyStringSchema("Surname"),
    login: nonEmptyStringSchema("Login"),
    password: z
        .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
        .min(6, "Password must be at least 6 characters"),
});

export const loginUserSchema = z.object({
    login: nonEmptyStringSchema("Login"),
    password: nonEmptyStringSchema("Password"),
});
