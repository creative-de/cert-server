import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";
import adminRouter from "./routers/adminRouter.js";
import queryRouter from "./routers/queryRouter.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://mtl.netlify.app/"],
    credentials: true,
  })
);
const PORT = process.env.PORT || 5000;
mongoose.connect(
  process.env.CONNECTION_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) console.log(error);
    console.log("Mongo db connected successfully");
  }
);

app.use("/auth", userRouter);
app.use("/query", queryRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${5000}`);
});
