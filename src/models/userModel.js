import mongoose from "mongoose";

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
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      required: true,
      Enum: ["Admin", "User"],
      Default: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Users", UserSchema);
