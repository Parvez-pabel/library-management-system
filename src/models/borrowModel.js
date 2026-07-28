import mongoose from "mongoose";

const BorrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    borrowDate: { type: String, default: new Date().toISOString() },
    returnDate: { type: String, default: null },
    status: {
      type: String,
      required: true,
      Enum: ["Borrowed", "Returned"],
      Default: "Borrowed",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Borrows", BorrowSchema);
