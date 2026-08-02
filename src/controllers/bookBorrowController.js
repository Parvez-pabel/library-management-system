import {
  borrowedBookByIdService,
  createBorrowService,
  getBorrowedBookService,
  returnBorrowedBookService,
} from "../services/bookBorrowService.js";
import { sendSuccess } from "../utils/responseHandler.js";

export const borrowBook = async (req, res, next) => {
  try {
    const result = await createBorrowService(req);
    return sendSuccess(res, "Book borrowed successfully.", result, 201);
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (req, res, next) => {
  try {
    const result = await returnBorrowedBookService(req);
    return sendSuccess(res, "Book returned successfully.", result, 200);
  } catch (error) {
    next(error);
  }
};

export const getMyBorrowedBooks = async (req, res, next) => {
  try {
    const result = await getBorrowedBookService(req);
    return sendSuccess(
      res,
      "Borrowed books fetched successfully.",
      result,
      200,
    );
  } catch (error) {
    next(error);
  }
};
export const getMyBorrowedBookById = async (req, res, next) => {
  try {
    const result = await borrowedBookByIdService(req);
    return sendSuccess(
      res,
      "Borrowed books fetched successfully.",
      result,
      200,
    );
  } catch (error) {
    next(error);
  }
};
