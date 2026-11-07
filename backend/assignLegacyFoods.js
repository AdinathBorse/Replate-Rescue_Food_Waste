import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import userModel from "./models/userModel.js";
import foodModel from "./models/foodModel.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(backendDirectory, ".env") });

const email = process.argv[2]?.trim();
const assignAllFoods = process.argv[3] === "--all";
if (!email) {
    console.error("Usage: node assignLegacyFoods.js <admin-email> [--all]");
    process.exitCode = 1;
} else if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing from backend/.env.");
    process.exitCode = 1;
} else {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const account = await userModel.findOne({
            email: { $regex: `^${escapedEmail}$`, $options: "i" },
        });

        if (!account) {
            console.error(`No account found for ${email}. Register an admin account first.`);
            process.exitCode = 1;
        } else if (account.role !== "admin") {
            console.error(`${email} is registered as a regular user, not an admin.`);
            process.exitCode = 1;
        } else {
            const result = await foodModel.updateMany(
                assignAllFoods
                    ? {}
                    : { $or: [{ adminId: { $exists: false } }, { adminId: "" }] },
                { adminId: account._id.toString() }
            );
            console.log("Foods matched:", result.matchedCount);
            console.log("Food ownerships changed:", result.modifiedCount);
        }
    } catch (error) {
        console.error("Failed to assign legacy foods:", error);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
}