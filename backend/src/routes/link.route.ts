import express from "express";
import {
  createNewLink,
  deleteLink,
  editProfile,
  getPublicProfile,
  getUserLinks,
  registerClick,
  reorderLinks,
  updateLink,
} from "../controllers/link.controller";
import { verifyToken } from "../middleware/middleware";
import { upload } from "../middleware/multer";

const router = express.Router();

router.get("/", verifyToken, getUserLinks);
router.get("/public/:username", getPublicProfile);
router.patch(
  "/public/profile",
  verifyToken,
  upload.single("image"),
  editProfile
);
router.post("/", verifyToken, createNewLink);
router.patch("/reorder", verifyToken, reorderLinks);
router.patch("/:id", verifyToken, updateLink);
router.delete("/:id", verifyToken, deleteLink);
router.post("/:id/click", registerClick);

export default router;
