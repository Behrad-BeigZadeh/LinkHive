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
const redis_1 = require("redis");
const logger_1 = __importDefault(require("../lib/logger"));
const redis = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redis.on("error", (err) => logger_1.default.error(`Redis Client Error: ${err.message}`, { stack: err.stack }));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis.connect();
        logger_1.default.info("Connected to Redis");
        const keys = yield redis.keys("*");
        logger_1.default.debug(`Redis keys on startup: ${keys.join(", ")}`);
    }
    catch (err) {
        logger_1.default.error(`Error connecting to Redis: ${err}`);
    }
}))();
exports.default = redis;
