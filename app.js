import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { notFoundHandler } from "./src/middleware/pageNotFoundHandler.js";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js";
import UserRouter from "./src/routes/userApi.js";
import BookRouter from "./src/routes/bookApi.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB

connectDB();
//server health

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

//base route
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/book", BookRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
