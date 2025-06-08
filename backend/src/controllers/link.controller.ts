import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/middleware";
import { prisma } from "../lib/prisma";
import {
  createLinkSchema,
  profileSchema,
  reorderSchema,
  updateLinkSchema,
} from "../schemas/linkSchema";
import cloudinary from "../utils/cloudinary";

export const getUserLinks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const user = req.user;

    const links = await prisma.link.findMany({
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPublicProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const user = req.user;

    const sanitizedBody = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== "")
    );

    const parsed = profileSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const file = req.file;
    const updatedData: any = {};

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
        const imageUrl = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "linkHive/avatar" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });

        updatedData.avatarUrl = imageUrl;
      } catch (uploadError) {
        return res.status(400).json({ error: "Image upload failed" });
      }
    }

    const { username, bio, password } = parsed.data;

    if (username) {
      const existingUserByUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUserByUsername && existingUserByUsername.id !== user.id) {
        return res.status(400).json({ error: "Username already taken" });
      }

      updatedData.username = username;
    }

    if (bio) updatedData.bio = bio;
    if (password) updatedData.password = password;

    const updatedUser = await prisma.user.update({
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createNewLink = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  {
    try {
      const parsed = createLinkSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }

      const { title, url, order } = parsed.data;

      const maxOrder = await prisma.link.aggregate({
        where: { userId: req.user.id },
        _max: { order: true },
      });

      const finalOrder = order ?? (maxOrder._max.order ?? 0) + 1;

      const newLink = await prisma.link.create({
        data: {
          title,
          url,
          order: finalOrder,
          userId: req.user.id,
          isActive: true,
        },
      });

      return res.status(201).json({ newLink });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const updateLink = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const linkId = req.params.id;
    const parsed = updateLinkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const { title, url, order, isActive } = parsed.data;

    const existing = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (title !== undefined) existing.title = title;
    if (url !== undefined) existing.url = url;
    if (order !== undefined) existing.order = order;
    if (typeof isActive === "boolean") existing.isActive = isActive;

    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: {
        title: existing.title,
        url: existing.url,
        order: existing.order,
        isActive: existing.isActive,
      },
    });

    return res.status(200).json({ updatedLink });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLink = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const link = await prisma.link.findUnique({
      where: { id: req.params.id },
    });

    if (!link || link.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.link.delete({
      where: { id: req.params.id },
    });

    const remainingLinks = await prisma.link.findMany({
      where: { userId: req.user.id },
      orderBy: { order: "asc" },
    });

    const updatePromises = remainingLinks.map((link, index) =>
      prisma.link.update({
        where: { id: link.id },
        data: { order: index + 1 },
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({ message: "Link deleted and orders updated" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const reorderLinks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const userId = req.user.id;
    const linkUpdates = parsed.data;
    const userLinks = await prisma.link.findMany({
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

    const updatePromises = linkUpdates.map((link) =>
      prisma.link.update({
        where: { id: link.id },
        data: { order: link.order },
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerClick = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const linkId = req.params.id;

    const link = await prisma.link.findUnique({ where: { id: linkId } });

    if (!link || !link.isActive) {
      return res.status(404).json({ error: "Link not found or inactive" });
    }

    await prisma.link.update({
      where: { id: linkId },
      data: { clicks: { increment: 1 } },
    });

    return res.status(200).json({ message: "Click registered" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
