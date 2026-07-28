import { sendError } from "../utils/responseHandler.js";

export const notFoundHandler = (req, res, next) => {
  return sendError(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Route not found.`,
    404,
  );
};
