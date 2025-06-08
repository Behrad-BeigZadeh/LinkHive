"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const link_controller_1 = require("../controllers/link.controller");
const middleware_1 = require("../middleware/middleware");
const multer_1 = require("../middleware/multer");
const router = express_1.default.Router();
router.get("/", middleware_1.verifyToken, link_controller_1.getUserLinks);
router.get("/public/:username", link_controller_1.getPublicProfile);
router.patch("/public/profile", middleware_1.verifyToken, multer_1.upload.single("image"), link_controller_1.editProfile);
router.post("/", middleware_1.verifyToken, link_controller_1.createNewLink);
router.patch("/reorder", middleware_1.verifyToken, link_controller_1.reorderLinks);
router.patch("/:id", middleware_1.verifyToken, link_controller_1.updateLink);
router.delete("/:id", middleware_1.verifyToken, link_controller_1.deleteLink);
router.post("/:id/click", link_controller_1.registerClick);
exports.default = router;
