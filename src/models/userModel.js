import mongoose from "mongoose";
import validator from "validator";
import { hashPassword, matchPassword } from "../utils/passwordHash.js";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 6 characters long"],
    },
    phone: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "User"],
      default: "User",
    },
    photo: {
      type: String,
    },
    otp: {
      type: String,
      default: "0",
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      default: "unverified",
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (userPassword) {
  return await matchPassword(userPassword, this.password);
};

export default mongoose.model("Users", UserSchema);
