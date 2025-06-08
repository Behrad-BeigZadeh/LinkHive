"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClick = exports.reorderLinks = exports.deleteLink = exports.updateLink = exports.createNewLink = exports.editProfile = exports.getPublicProfile = exports.getUserLinks = void 0;
const prisma_1 = require("../lib/prisma");
const linkSchema_1 = require("../schemas/linkSchema");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const getUserLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const links = yield prisma_1.prisma.link.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                order: "asc",
            },
        });
        if (links.length === 0) {
            return res.status(200).json({ data: { message: "No links found" } });
        }
        return res.status(200).json({ links });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserLinks = getUserLinks;
const getPublicProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const user = yield prisma_1.prisma.user.findUnique({
            where: { username },
            select: {
                username: true,
                avatarUrl: true,
                bio: true,
                links: {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        clicks: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ profile: user });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getPublicProfile = getPublicProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const sanitizedBody = Object.fromEntries(Object.entries(req.body).filter(([_, value]) => value !== ""));
        const parsed = linkSchema_1.profileSchema.safeParse(sanitizedBody);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.errors });
        }
        const file = req.file;
        const updatedData = {};
        if (file) {
            if (!file.mimetype.startsWith("image/")) {
                return res.status(400).json({ error: "Invalid image file" });
            }
            const allowedTypes = ["image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    error: "Invalid file type. Only JPG and PNG are allowed.",
                });
            }
            if (file.size > 2 * 1024 * 1024) {
                return res.status(400).json({
                    error: "File size too large. Maximum size is 2MB.",
                });
            }
            try {
                const imageUrl = yield new Promise((resolve, reject) => {
                    const stream = cloudinary_1.default.uploader.upload_stream({ folder: "linkHive/avatar" }, (error, result) => {
                        if (error || !result)
                            return reject(error);
                        resolve(result.secure_url);
                    });
                    stream.end(file.buffer);
                });
                updatedData.avatarUrl = imageUrl;
            }
            catch (uploadError) {
                return res.status(400).json({ error: "Image upload failed" });
            }
        }
        const { username, bio, password } = parsed.data;
        if (username) {
            const existingUserByUsername = yield prisma_1.prisma.user.findUnique({
                where: { username },
            });
            if (existingUserByUsername && existingUserByUsername.id !== user.id) {
                return res.status(400).json({ error: "Username already taken" });
            }
            updatedData.username = username;
        }
        if (bio)
            updatedData.bio = bio;
        if (password)
            updatedData.password = password;
        const updatedUser = yield prisma_1.prisma.user.update({
            where: { id: user.id },
            data: updatedData,
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                bio: true,
                email: true,
            },
        });
        return res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.editProfile = editProfile;
const createNewLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    {
        try {
            const parsed = linkSchema_1.createLinkSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.errors });
            }
            const { title, url, order } = parsed.data;
            const maxOrder = yield prisma_1.prisma.link.aggregate({
                where: { userId: req.user.id },
                _max: { order: true },
            });
            const finalOrder = order !== null && order !== void 0 ? order : ((_a = maxOrder._max.order) !== null && _a !== void 0 ? _a : 0) + 1;
            const newLink = yield prisma_1.prisma.link.create({
                data: {
                    title,
                    url,
                    order: finalOrder,
                    userId: req.user.id,
                    isActive: true,
                },
            });
            return res.status(201).json({ newLink });
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.createNewLink = createNewLink;
const updateLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const linkId = req.params.id;
        const parsed = linkSchema_1.updateLinkSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.errors });
        }
        const { title, url, order, isActive } = parsed.data;
        const existing = yield prisma_1.prisma.link.findUnique({
            where: { id: linkId },
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        if (title !== undefined)
            existing.title = title;
        if (url !== undefined)
            existing.url = url;
        if (order !== undefined)
            existing.order = order;
        if (typeof isActive === "boolean")
            existing.isActive = isActive;
        const updatedLink = yield prisma_1.prisma.link.update({
            where: { id: linkId },
            data: {
                title: existing.title,
                url: existing.url,
                order: existing.order,
                isActive: existing.isActive,
            },
        });
        return res.status(200).json({ updatedLink });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateLink = updateLink;
const deleteLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = yield prisma_1.prisma.link.findUnique({
            where: { id: req.params.id },
        });
        if (!link || link.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        yield prisma_1.prisma.link.delete({
            where: { id: req.params.id },
        });
        const remainingLinks = yield prisma_1.prisma.link.findMany({
            where: { userId: req.user.id },
            orderBy: { order: "asc" },
        });
        const updatePromises = remainingLinks.map((link, index) => prisma_1.prisma.link.update({
            where: { id: link.id },
            data: { order: index + 1 },
        }));
        yield Promise.all(updatePromises);
        return res.status(200).json({ message: "Link deleted and orders updated" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteLink = deleteLink;
const reorderLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = linkSchema_1.reorderSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.errors });
        }
        const userId = req.user.id;
        const linkUpdates = parsed.data;
        const userLinks = yield prisma_1.prisma.link.findMany({
            where: {
                userId,
                id: { in: linkUpdates.map((l) => l.id) },
            },
            select: { id: true },
        });
        const userLinkIds = userLinks.map((l) => l.id);
        const unauthorized = linkUpdates.some((l) => !userLinkIds.includes(l.id));
        if (unauthorized) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const updatePromises = linkUpdates.map((link) => prisma_1.prisma.link.update({
            where: { id: link.id },
            data: { order: link.order },
        }));
        yield Promise.all(updatePromises);
        return res.status(200).json({ message: "Order updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.reorderLinks = reorderLinks;
const registerClick = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const linkId = req.params.id;
        const link = yield prisma_1.prisma.link.findUnique({ where: { id: linkId } });
        if (!link || !link.isActive) {
            return res.status(404).json({ error: "Link not found or inactive" });
        }
        yield prisma_1.prisma.link.update({
            where: { id: linkId },
            data: { clicks: { increment: 1 } },
        });
        return res.status(200).json({ message: "Click registered" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.registerClick = registerClick;
