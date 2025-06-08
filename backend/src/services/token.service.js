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
exports.storeRefreshToken = storeRefreshToken;
exports.validateRefreshToken = validateRefreshToken;
exports.deleteRefreshToken = deleteRefreshToken;
const redis_1 = __importDefault(require("../utils/redis"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const REFRESH_EXPIRE_SECONDS = 60 * 60 * 24 * 7;
function storeRefreshToken(userId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedToken = yield bcrypt_1.default.hash(token, 10);
        yield redis_1.default.set(`refresh:${userId}`, hashedToken, {
            EX: REFRESH_EXPIRE_SECONDS,
        });
    });
}
function validateRefreshToken(userId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const storedHashed = yield redis_1.default.get(`refresh:${userId}`);
        if (!storedHashed)
            return false;
        return yield bcrypt_1.default.compare(token, storedHashed);
    });
}
function deleteRefreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield redis_1.default.del(`refresh:${userId}`);
    });
}
