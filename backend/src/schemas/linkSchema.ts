import { z } from "zod";

export const createLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
  order: z.number().optional(),
});

export const updateLinkSchema = z.object({
  title: z.string().min(1).optional(),
  url: z.string().url().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const reorderSchema = z.array(
  z.object({
    id: z.string().uuid(),
    order: z.number().int().nonnegative(),
  })
);

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
  bio: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});
