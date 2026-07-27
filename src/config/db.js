import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Mongo_URI is missing");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
  } catch (error) {
    console.error("❌ Error in DB connection", error.message);
    process.exit(1);
  }
};

export default connectDB;
