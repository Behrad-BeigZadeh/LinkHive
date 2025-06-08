"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = exports.reorderSchema = exports.updateLinkSchema = exports.createLinkSchema = void 0;
const zod_1 = require("zod");
exports.createLinkSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    url: zod_1.z.string().url("Invalid URL"),
    order: zod_1.z.number().optional(),
});
exports.updateLinkSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    url: zod_1.z.string().url().optional(),
    order: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.reorderSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string().uuid(),
    order: zod_1.z.number().int().nonnegative(),
}));
exports.profileSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters")
        .optional(),
    avatarUrl: zod_1.z.string().url("Invalid URL").optional(),
    bio: zod_1.z.string().optional(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
});
