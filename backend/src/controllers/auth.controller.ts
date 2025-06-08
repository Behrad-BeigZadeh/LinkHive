import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { AuthenticatedRequest } from "../middleware/middleware";
import {
  deleteRefreshToken,
  storeRefreshToken,
  validateRefreshToken,
} from "../services/token.service";
import jwt, { JwtPayload } from "jsonwebtoken";

export const Signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const { username, email, password } = parsed.data;

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
      username || "user"
    )}`;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatarUrl: avatar,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);
    return res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        data: {
          accessToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
          },
        },
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const Login = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        data: {
          accessToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
          },
        },
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const Logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(204).send();
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await deleteRefreshToken(userId);

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ data: { message: "User logged out successfully" } });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const RefreshToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not found" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isValid = await validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
      },
    });

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    await storeRefreshToken(userId, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      data: {
        user,
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
