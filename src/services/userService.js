import userModel from "../models/userModel.js";
import { generateOTP, getOtpExpiryTime } from "../utils/otpHelper.js";

export const registerUserService = async (req) => {
  try {
    const { name, email, password, phone } = req.body;
    let userCount = await userModel.countDocuments({
      email: email,
    });

    if (userCount > 0) {
      return { status: "fail", data: "Email already exist" };
    }
    const otp = generateOTP(6);
    const otpExpiry = getOtpExpiryTime(2);

    const newUser = await userModel.create({
      name,
      email,
      password,
      phone,
      otp,
      otpExpiry,
      status: "unverified",
    });
    const returnOBJ = {
      UserEmail: email,
      OTP: otp,
      otpExpiry: otpExpiry,
      status: "unverified",
    };
    return returnOBJ;
  } catch (error) {
    throw error;
  }
};
