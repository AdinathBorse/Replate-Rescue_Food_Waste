import express from "express";
import {addFood,listFood,listMyFood,removeFood,getMysteryBags} from "../controllers/foodController.js";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";


const foodRouter = express.Router();

//image upload setup
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage:storage})

foodRouter.post("/add", authMiddleware, adminOnly, upload.single("image"), addFood);
foodRouter.get("/list", listFood);                                   // public, customers need it
foodRouter.get("/myfoods", authMiddleware, adminOnly, listMyFood);
foodRouter.get("/mystery-bags", getMysteryBags);
foodRouter.post("/remove", authMiddleware, adminOnly, removeFood);




export default foodRouter;
