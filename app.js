

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB

connectDB();

// app.use("/api/v1", router);


//server health

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

export default app;
