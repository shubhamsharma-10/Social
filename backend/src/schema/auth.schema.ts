import zod from "zod";

export const registerSchema = zod.object({
    email: zod
        .string()
        .email("Invalid email address"),
    username: zod
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long"),
    displayName: zod
        .string()
        .min(3, "Display name must be at least 3 characters long")
        .max(50, "Display name must be at most 50 characters long"),
    password: zod
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
})

export const loginSchema = zod.object({
    email: zod
        .string()
        .email("Invalid email address"),
    password: zod
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
})