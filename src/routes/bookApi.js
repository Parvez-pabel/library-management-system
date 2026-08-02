import express from "express";
import {
  bookDelete,
  bookUpdate,
  createBook,
  getallBooks,
  getBookDetails,
} from "../controllers/bookAuthorController.js";
import { authRole, protect } from "../middleware/authMiddleware.js";
import {
  borrowBook,
  getMyBorrowedBookById,
  getMyBorrowedBooks,
  returnBook,
} from "../controllers/bookBorrowController.js";

const BookRouter = express.Router();

BookRouter.post("/create", protect, authRole("Admin"), createBook);
BookRouter.get("/all-books", protect, authRole("Admin"), getallBooks);
BookRouter.put("/update/:id", protect, authRole("Admin"), bookUpdate);
BookRouter.delete("/delete/:id", protect, authRole("Admin"), bookDelete);
BookRouter.get("/:id", protect, getBookDetails);

//borrow book service route
BookRouter.post("/borrow-book", protect, authRole("Admin"), borrowBook);
BookRouter.put("/return-book/:id", protect, authRole("Admin"), returnBook);
BookRouter.get(
  "/all-borrow-book",
  protect,
  authRole("Admin"),
  getMyBorrowedBooks,
);
BookRouter.get(
  "/borrow-book/:id",
  protect,
  authRole("Admin"),
  getMyBorrowedBookById,
);
export default BookRouter;
