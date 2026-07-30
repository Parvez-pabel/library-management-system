import { registerUserService } from "../services/userService.js";
import { sendSuccess } from "./../utils/responseHandler.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUserService(req, res);
    return sendSuccess(
      res,
      result,
      "Registration is pending, Please verify the OTP sent to your email.",
      201,
    );
  } catch (error) {
    next(error);
  }
};
