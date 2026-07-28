import { sendError } from "../utils/responseHandler.js";
import { DecodeToken } from "../utils/TokenHelper.js";

//protecting route from unauthorize access
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return sendError(res, "Please login", 401);
  }
  const decoded = DecodeToken(token);
  if (!decoded) {
    return sendError(res, "Expired Token", 401);
  }
  req.user = decoded;
  next();
};

//authorize roles

export const authRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Role (${req.user.role}) is not authorize to access this resource`,
        403,
      );
    }
    next();
  };
};
