import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";
import { getReport } from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/summary", authMiddleware, adminOnly, getReport);

export default reportRouter;
