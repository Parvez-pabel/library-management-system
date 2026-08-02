import express from "express";
import {
  bookDelete,
  bookUpdate,
  createBook,
  getallBooks,
} from "../controllers/bookAuthorController.js";
import { authRole, protect } from "../middleware/authMiddleware.js";

const BookRouter = express.Router();

BookRouter.post("/create", protect, authRole("Admin"), createBook);
BookRouter.get("/all-books", protect, authRole("Admin"), getallBooks);
BookRouter.put("/update/:id", protect, authRole("Admin"), bookUpdate);
BookRouter.delete("/delete/:id", protect, authRole("Admin"), bookDelete);

export default BookRouter;
