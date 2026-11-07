import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";



// Create Food Item
const addFood = async (req, res) => {

   let image_fname = `${req.file.filename}`;

   const isMystery = req.body.isMysteryBag === "true" || req.body.isMysteryBag === true;

   const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: image_fname,
      isMysteryBag: isMystery,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : 0,
      dietaryType: req.body.dietaryType || "Veg",
      stock: req.body.stock ? Number(req.body.stock) : 0,
      startTime: req.body.startTime || "9:00 PM",
      endTime: req.body.endTime || "11:45 PM",
      adminId: req.user.userId
   })
   try {
      await food.save();
      res.json({ success: true, message: "Food item added successfully" })
   } catch (err) {
      console.log(err)
      res.json({ success: false, message: "Error in adding food item" })
   }
}

//All Food Items
const listFood = async (req, res) => {
   try {
      const foods = await foodModel.find({});
      res.json({ success: true, data: foods });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
}

const listMyFood = async (req, res) => {
   try {
      const foods = await foodModel.find({ adminId: req.user.userId });
      res.json({ success: true, data: foods });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
}

// Get Mystery Surplus Bags
const getMysteryBags = async (req, res) => {
   try {
      const mysteryBags = await foodModel.find({ isMysteryBag: true });
      res.json({ success: true, data: mysteryBags });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error fetching mystery bags" });
   }
}

//Remove food items
const removeFood = async (req, res) => {
   try {
      const food = await foodModel.findById(req.body.id);
      if (!food) {
         return res.json({ success: false, message: "Food item not found" });
      }
      if (food.adminId !== req.user.userId) {
         return res.json({ success: false, message: "You can only remove your own food items" });
}

      // Check if any other food item in DB is still using this exact same image file
      const otherItemUsingImage = await foodModel.findOne({
         _id: { $ne: food._id },
         image: food.image
      });

      // ONLY delete image from disk if no other item is using it
      if (!otherItemUsingImage && food.image) {
         const imagePath = `uploads/${food.image}`;
         if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
               if (err) console.log("Error unlinking image:", err);
            });
         }
      }

      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food item removed successfully" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error in removing food item" });
   }
}
export { addFood, listFood, listMyFood, removeFood, getMysteryBags };