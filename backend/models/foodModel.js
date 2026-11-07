import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isMysteryBag: { type: Boolean, default: false },
    originalPrice: { type: Number, default: 0 },
    dietaryType: { type: String, enum: ["Veg", "Non-Veg", "Bakery", "Any"], default: "Veg" },
    stock: { type: Number, default: 0 },
    startTime: { type: String, default: "9:00 PM" },
    endTime: { type: String, default: "11:45 PM" },
    adminId: { type: String, default: "" },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;