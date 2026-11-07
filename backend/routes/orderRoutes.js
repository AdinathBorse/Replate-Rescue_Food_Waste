import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder,userOrders, listOrders, updateStatus } from "../controllers/orderController.js"
import adminOnly from "../middleware/adminOnly.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list", authMiddleware, adminOnly, listOrders);
orderRouter.post("/update", authMiddleware, adminOnly, updateStatus);
orderRouter.post("/status", authMiddleware, adminOnly, updateStatus);

export default orderRouter;