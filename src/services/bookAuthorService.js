import bookModel from "../models/bookModel.js";
import { paginate } from "../utils/paginate.js";

export const bookCreateService = async (req) => {
  try {
    const {
      title,
      author,
      photo,
      category,
      isbn,
      publishedYear,
      description,
      availableCopies,
    } = req.body;
    const adminId = req.user.userID;

    if (
      !title ||
      !author ||
      !photo ||
      !category ||
      !isbn ||
      !publishedYear ||
      !description ||
      !availableCopies ||
      !adminId
    ) {
      const error = new Error("Required fields are missing");
      error.statusCode = 404;
      throw error;
    }
    const existingBook = await bookModel.findOne({ isbn });
    if (existingBook) {
      const error = new Error("A book with this ISBN already exists.");
      error.statusCode = 400;
      throw error;
    }
    const newBookData = {
      title,
      author,
      photo,
      category,
      isbn,
      publishedYear,
      description,
      availableCopies,
      createdBy: adminId,
    };
    const book = await bookModel.create(newBookData);
    return book;
  } catch (error) {
    throw error;
  }
};

export const getAllBooksService = async (req) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
        { description: searchRegex },
      ];
    }

    const books = await paginate({
      model: bookModel,
      reqQuery: req.query,
      customFilter: filter,
      selectFields: "-__v",
      populateOptions: {
        path: "createdBy",
        select: "name email role -_id",
      },
    });

    return books;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const bookUpdateService = async (req) => {
  try {
    const bookId = req.params.id;
    let reqBody = { ...req.body };

    if (!bookId) {
      const error = new Error("Book ID is required in request parameters.");
      error.statusCode = 400;
      throw error;
    }
    delete reqBody._id;
    delete reqBody.createdBy;
    delete reqBody.createdAt;
    delete reqBody.updatedAt;
    if (reqBody.isbn) {
      const existingBook = await bookModel.findOne({
        isbn: reqBody.isbn,
        _id: { $ne: bookId },
      });

      if (existingBook) {
        const error = new Error("Another book already exists with this ISBN.");
        error.statusCode = 400;
        throw error;
      }
    }
    let updateBook = await bookModel
      .findByIdAndUpdate(
        bookId,
        { $set: reqBody },
        { new: true, runValidators: true },
      )
      .select("-__v");
    if (!updateBook) {
      const error = new Error("Book not found with the provided ID.");
      error.statusCode = 404;
      throw error;
    }
    return updateBook;
  } catch (error) {
    throw error;
  }
};
export const DeleteService = async (req) => {
  try {
    const bookID = req.params.id;
    const currentUserRole = req.user?.role;
    const currentUserID = req.user?.userID;

    if (!bookID) {
      const error = new Error("Book ID is required in request parameters.");
      error.statusCode = 404;
      throw error;
    }
    if (currentUserRole !== "Admin") {
      const error = new Error(
        "You cannot perform this action. Admin role required.",
      );
      error.statusCode = 403;
      throw error;
    }

    const deletedBook = await bookModel.findByIdAndDelete(bookID);

    if (!deletedBook) {
      const error = new Error("Book not found with the provided ID.");
      error.statusCode = 404;
      throw error;
    }

    return deletedBook;
  } catch (error) {
    throw error;
  }
};
