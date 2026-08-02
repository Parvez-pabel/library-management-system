import {
  bookCreateService,
  bookUpdateService,
  DeleteService,
  getAllBooksService,
  getBookDetailsService,
} from "../services/bookAuthorService.js";
import { sendSuccess } from "../utils/responseHandler.js";

export const createBook = async (req, res, next) => {
  try {
    const result = await bookCreateService(req, res);
    return sendSuccess(
      res,
      result,
      `${result.title} successfully created by ${result.createdBy}`,
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const getallBooks = async (req, res, next) => {
  try {
    const result = await getAllBooksService(req, res);
    return sendSuccess(res, result, "All books", 201);
  } catch (error) {
    next(error);
  }
};
export const bookDelete = async (req, res, next) => {
  try {
    const result = await DeleteService(req, res);
    return sendSuccess(
      res,
      result,
      `${result.title} Book deleted successfully`,
      201,
    );
  } catch (error) {
    next(error);
  }
};
export const bookUpdate = async (req, res, next) => {
  try {
    const result = await bookUpdateService(req, res);
    return sendSuccess(
      res,
      result,
      `${result.title} Book updated successfully`,
      201,
    );
  } catch (error) {
    next(error);
  }
};
export const getBookDetails = async (req, res, next) => {
  try {
    const result = await getBookDetailsService(req);
    return sendSuccess(res, result, "Book details fetched successfully", 200);
  } catch (error) {
    next(error);
  }
};
