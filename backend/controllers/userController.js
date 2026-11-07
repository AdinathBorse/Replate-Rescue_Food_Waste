import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const uploadsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

//login (same endpoint for customers and admins)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Doesn't exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        const token = createToken(user._id, user.role);
        res.json({
            success: true,
            message: "User login successfully",
            token,
            role: user.role,
            name: user.name,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in login user" });
    }
}

//shared register logic for customers and admins
const createAccount = async (req, res, role) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword, role });
        const user = await newUser.save();
        const token = createToken(user._id, user.role);
        res.json({
            success: true,
            message: "User registered successfully",
            token,
            role: user.role,
            name: user.name,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in registering user" });
    }
}

const registerUser = (req, res) => createAccount(req, res, "user");

const registerAdmin = (req, res) => {
    if (!process.env.ADMIN_SIGNUP_CODE) {
        return res.status(500).json({
            success: false,
            message: "Admin registration is not configured. Set ADMIN_SIGNUP_CODE in backend/.env.",
        });
    }
    if (req.body.adminCode !== process.env.ADMIN_SIGNUP_CODE) {
        return res.json({ success: false, message: "Invalid admin code" });
    }
    return createAccount(req, res, "admin");
}

const updateAdminProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Choose an image to upload." });
    }

    try {
        const admin = await userModel.findOneAndUpdate(
            { _id: req.user.userId, role: "admin" },
            { profileImage: req.file.filename },
            { new: true }
        );

        if (!admin) {
            await fs.unlink(req.file.path);
            return res.status(404).json({ success: false, message: "Admin account not found." });
        }

        if (
            admin.profileImage?.startsWith("admin-profile-")
            && admin.profileImage !== req.file.filename
        ) {
            const previousImagePath = path.join(uploadsDirectory, path.basename(admin.profileImage));
            await fs.unlink(previousImagePath).catch((error) => {
                if (error.code !== "ENOENT") {
                    console.error("Could not remove previous admin profile image:", error);
                }
            });
        }

        return res.json({
            success: true,
            message: "Profile image updated.",
            profileImage: admin.profileImage,
        });
    } catch (error) {
        await fs.unlink(req.file.path).catch((cleanupError) => {
            if (cleanupError.code !== "ENOENT") {
                console.error("Could not remove failed profile image upload:", cleanupError);
            }
        });
        console.error("Could not update admin profile image:", error);
        return res.status(500).json({ success: false, message: "Could not update profile image." });
    }
}

export { loginUser, registerUser, registerAdmin, updateAdminProfileImage };