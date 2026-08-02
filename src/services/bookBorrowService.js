import bookModel from "../models/bookModel.js";
import borrowModel from "../models/borrowModel.js";
import { paginate } from "../utils/paginate.js";

export const createBorrowService = async (req) => {
  try {
    const { bookID } = req.body;
    const userID = req.user.userID;

    if (!bookID) {
      const error = new Error("Book ID is required.");
      error.statusCode = 400;
      throw error;
    }

    const existingBorrowedBook = await bookModel.findOne({
      user: userID,
      book: bookID,
      status: "Borrowed",
    });

    if (existingBorrowedBook) {
      const error = new Error(
        "You have already borrowed this book and not returned it yet.",
      );
      error.statusCode = 400;
      throw error;
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookID,
        availableCopies: { $gt: 0 },
      },
      {
        $inc: { availableCopies: -1 },
      },
      {
        new: true,
      },
    );
    if (!updatedBook) {
      const error = new Error(
        "Book is currently out of stock or does not exist.",
      );
      error.statusCode = 400;
      throw error;
    }
    const borrowBookRecord = await borrowModel.create({
      user: userID,
      book: bookID,
      borrowDate: new Date(),
      status: "Borrowed",
    });
    return borrowBookRecord;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const returnBorrowedBookService = async (req) => {
  try {
    const borrowedID = req.params.id;
    const userID = req.user.userID;
    if (!borrowedID) {
      const error = new Error("Borrow Record ID is required.");
      error.statusCode = 400;
      throw error;
    }
    const borrowRecord = await borrowModel.findOne({
      _id: borrowedID,
      user: userID,
      status: "Borrowed",
    });

    if (!borrowRecord) {
      const error = new Error(
        "Active borrow record not found or book already returned.",
      );
      error.statusCode = 404;
      throw error;
    }
    borrowRecord.status = "Returned";
    borrowRecord.returnDate = new Date();
    await borrowRecord.save();
    await bookModel.findByIdAndUpdate(borrowRecord.book, {
      $inc: { availableCopies: 1 },
    });

    return borrowRecord;
  } catch (error) {
    throw error;
  }
};

export const getBorrowedBookService = async (req) => {
  try {
    const userID = req.user.userID;
    const userRole = req.user.role;
    const { status } = req.query;
    const filter = {};

    if (userRole !== "Admin") {
      filter.user = userID;
    }
    if (status) {
      filter.status = status;
    }
    const borrowedBooks = await paginate({
      model: borrowModel,
      reqQuery: req.query,
      customFilter: filter,
      selectFields: "-__v",
      populateOptions: [
        {
          path: "book",
          select: "title author photo isbn category availableCopies",
        },
        {
          path: "user",
          select: "name email role phone",
        },
      ],
    });
    return borrowedBooks;
  } catch (error) {
    throw error;
  }
};
export const borrowedBookByIdService = async (req) => {
  try {
    const borrowedID = req.params.id;
    const userID = req.user.userID;
    const userRole = req.user.role;
    if (!borrowedID) {
      const error = new Error("Borrowed Record ID is required.");
      error.statusCode = 400;
      throw error;
    }

    const filter = { _id: borrowedID };

    if (userRole !== "Admin") {
      filter.user = userID;
    }

    const borrowedBook = await borrowModel
      .findOne(filter)
      .select("-__v")
      .populate({
        path: "book",
        select:
          "title author photo isbn category availableCopies publishedYear description",
      })
      .populate({
        path: "user",
        select: "name email role phone",
      });
    if (!borrowedBook) {
      const error = new Error("Borrowed record not found or access denied.");
      error.statusCode = 404;
      throw error;
    }
    return borrowedBook;
  } catch (error) {
    throw error;
  }
};
