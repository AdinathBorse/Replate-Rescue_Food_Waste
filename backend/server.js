import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { connectDB } from './config/db.js';
import foodRouter from "./routes/foodroutes.js";
import userRouter from './routes/userRoute.js';
import 'dotenv/config'
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import reportRouter from './routes/reportRoutes.js';

//app config
const app = express();
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());

//DB connection
connectDB();


//api endpoints
app.use("/api/food",foodRouter);
app.use('/images', express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/report", reportRouter)



app.get("/", (req, res) => {
    res.send("Hello from backend,API is working");
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
