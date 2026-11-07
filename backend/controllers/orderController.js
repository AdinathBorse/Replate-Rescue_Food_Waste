import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order from frontend (one order per restaurant)
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5174"

    try {
        const cartItems = req.body.items || [];

        // 1. read real food data (name, price, owner) from the database


        const foods = await foodModel.find({ _id: { $in: cartItems.map(i => i._id) } });
        const foodMap = {};
        foods.forEach(f => { foodMap[f._id.toString()] = f; });

        // 2. group cart items by the admin who added the food

        const groups = {};
        cartItems.forEach(item => {
            const food = foodMap[item._id];
            if (!food) return;
            const owner = food.adminId || "unassigned";
            if (!groups[owner]) groups[owner] = [];
            groups[owner].push({ _id: item._id, name: food.name, price: food.price, quantity: item.quantity });
        });
        if (Object.keys(groups).length === 0) {
            return res.json({ success: false, message: "Cart is empty" });
        }

        // 3. create one order per restaurant, all linked by one groupId

        const groupId = randomUUID();
        const line_items = [];
        let firstOrderId = null;

        for (const ownerId of Object.keys(groups)) {
            const items = groups[ownerId];
            const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            const admin = mongoose.isValidObjectId(ownerId) ? await userModel.findById(ownerId) : null;
            const restaurantName = admin ? admin.name : "Restaurant";

            const newOrder = new orderModel({
                userId: req.user.userId,
                adminId: ownerId,
                restaurantName: restaurantName,
                groupId: groupId,
                items: items,
                amount: subtotal + 50,
                address: req.body.address
            })
            await newOrder.save();
            if (!firstOrderId) firstOrderId = newOrder._id;

            items.forEach((item) => line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100 * 1)
                },
                quantity: item.quantity
            }));
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: { name: "Delivery Charges (" + restaurantName + ")" },
                    unit_amount: 50 * 100 * 1
                },
                quantity: 1
            });
        }

        await userModel.findByIdAndUpdate(req.user.userId, { cartData: {} })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${firstOrderId}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${firstOrderId}`
        })
        res.json({ success: true, session_url: session.url })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// marks every order of the same payment (groupId) as paid, or removes them

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        const filter = order.groupId ? { groupId: order.groupId } : { _id: order._id };
        if (success == "true") {
            await orderModel.updateMany(filter, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.deleteMany(filter);
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//user orders for frontend (all restaurants)

const userOrders = async (req, res) => {
    try {
        const userId = req.user && req.user.userId;
        const orders = await orderModel.find({ userId: userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//listing orders for admin panel: only this admin's paid orders
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ adminId: req.user.userId, payment: true }).sort({ _id: -1 });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//api for updating order status: only the owner admin
const updateStatus = async (req, res) => {
    try {
        const order = await orderModel.findById(req.body.orderId);
        if (!order || order.adminId !== req.user.userId) {
            return res.json({ success: false, message: "Not your order" });
        }
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };