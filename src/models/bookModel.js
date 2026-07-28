import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    publishedYear: { type: String, required: true },
    description: { type: String },
    availableCopies: { type: Number, required: true, min: 0, default: 1 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Books", BookSchema);
