import express from "express";
import { mkdirSync } from "node:fs";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { loginUser, registerUser, registerAdmin, updateAdminProfileImage } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";

const uploadsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");
mkdirSync(uploadsDirectory, { recursive: true });
const profileImageUpload = multer({
    storage: multer.diskStorage({
        destination: uploadsDirectory,
        filename: (_req, file, callback) => {
            const extensionByMimeType = {
                "image/jpeg": ".jpg",
                "image/png": ".png",
                "image/webp": ".webp",
            };
            callback(null, `admin-profile-${randomUUID()}${extensionByMimeType[file.mimetype]}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
            const error = new Error("Profile image must be a JPEG, PNG, or WebP file.");
            error.code = "INVALID_FILE_TYPE";
            return callback(error);
        }
        callback(null, true);
    },
});
const handleProfileImageUpload = (req, res, next) => {
    profileImageUpload.single("profileImage")(req, res, (error) => {
        if (error) {
            const status = error instanceof multer.MulterError
                ? (error.code === "LIMIT_FILE_SIZE" ? 413 : 400)
                : (error.code === "INVALID_FILE_TYPE" ? 400 : 500);
            return res.status(status).json({ success: false, message: error.message });
        }
        next();
    });
};

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/admin/register", registerAdmin);
userRouter.post("/login", loginUser);
userRouter.post(
    "/admin/profile-image",
    authMiddleware,
    adminOnly,
    handleProfileImageUpload,
    updateAdminProfileImage
);

export default userRouter;