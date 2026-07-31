import {
  loginService,
  profileDetailService,
  registerUserService,
  resendOTPService,
  verifyOTPService,
} from "../services/userService.js";
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
export const verifyOTP = async (req, res, next) => {
  try {
    const result = await verifyOTPService(req, res);
    return sendSuccess(res, result, "Registration successful", 201);
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const result = await resendOTPService(req);
    return sendSuccess(res, result, "Resend Otp", 201);
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const result = await loginService(req);
    return sendSuccess(res, result, "Login successful", 201);
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const result = await profileDetailService(req);
    return sendSuccess(res, result,"Profile fetched successfully", 201);
  } catch (error) {
    next(error);
  }
};
