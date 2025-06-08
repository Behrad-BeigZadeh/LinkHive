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
exports.RefreshToken = exports.Logout = exports.Login = exports.Signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const authSchema_1 = require("../schemas/authSchema");
const token_service_1 = require("../services/token.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = authSchema_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.errors });
        }
        const { username, email, password } = parsed.data;
        const existingUserByUsername = yield prisma_1.prisma.user.findUnique({
            where: { username },
        });
        if (existingUserByUsername) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const existingUserByEmail = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUserByEmail) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const avatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(username || "user")}`;
        const user = yield prisma_1.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                avatarUrl: avatar,
            },
        });
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        yield (0, token_service_1.storeRefreshToken)(user.id, refreshToken);
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
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.Signup = Signup;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = authSchema_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.errors });
        }
        const { email, password } = parsed.data;
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        yield (0, token_service_1.storeRefreshToken)(user.id, refreshToken);
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
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.Login = Login;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!refreshToken) {
            return res.status(204).send();
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        yield (0, token_service_1.deleteRefreshToken)(userId);
        return res
            .clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        })
            .status(200)
            .json({ data: { message: "User logged out successfully" } });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.Logout = Logout;
const RefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token not found" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const isValid = yield (0, token_service_1.validateRefreshToken)(userId, refreshToken);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                avatarUrl: true,
            },
        });
        const newAccessToken = (0, jwt_1.generateAccessToken)(userId);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(userId);
        yield (0, token_service_1.storeRefreshToken)(userId, newRefreshToken);
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
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.RefreshToken = RefreshToken;
