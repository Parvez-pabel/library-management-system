import userModel from "../models/userModel.js";
import { generateOTP, getOtpExpiryTime } from "../utils/otpHelper.js";
import { matchPassword } from "../utils/passwordHash.js";
import { CreateToken } from "./../utils/TokenHelper.js";

//register
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
//verify otp
export const verifyOTPService = async (req, res) => {
  try {
    let email = req.params.email;
    let otp = req.params.otp;

    let user = await userModel.findOne({
      email: email,
      otp: otp,
    });

    if (user) {
      const currentTime = new Date();
      if (currentTime > user.otpExpiry) {
        return {
          status: "fail",
          data: "OTP has expired, please request a new OTP",
        };
      }

      const updatedData = await userModel.updateOne(
        { email: email },
        {
          $set: {
            otp: "0",
            status: "verified",
          },
        },
      );
      return updatedData;
    } else {
      return { status: "fail", data: "Invalid OTP" };
    }
  } catch (error) {
    throw error;
  }
};

//resent otp feature

export const resendOTPService = async (req) => {
  try {
    const email = req.params.email;
    const user = await userModel.findOne({ email });
    if (user.status === "verified") {
      const error = new Error("This account is already verified.");
      error.statusCode = 400;
      throw error;
    }
    const newOTP = generateOTP(6);
    const newOtpExpiry = getOtpExpiryTime(2);

    user.otp = newOTP;
    user.otpExpiry = newOtpExpiry;
    await user.save();

    return {
      UserEmail: user.email,
      OTP: newOTP,
      otpExpiry: newOtpExpiry,
      status: user.status,
    };
  } catch (error) {
    throw error;
  }
};
//login
export const loginService = async (req) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({
      email: email,
      status: "verified",
    });
    if (!user) {
      const error = new Error("No account found with this email.");
      error.statusCode = 404;
      throw error;
    }
    let isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      const error = new Error("Wrong password");
      error.statusCode = 403;
      throw error;
    }
    let tokenPayload = {
      email: user.email,
      role: user.role,
      userID: user._id,
    };
    let token = await CreateToken(tokenPayload);
    return {
      user: tokenPayload,
      token: token,
    };
  } catch (error) {
    throw error;
  }
};
//profile details
export const profileDetailService = async (req) => {
  try {
    const userID = req.user.userID;
    let Profile = await userModel.findOne(
      { _id: userID },
      {
        password: 0,
        otp: 0,
        otpExpiry: 0,
        status: 0,
      },
    );
    if (!Profile) {
      const error = new Error("User profile not found.");
      error.statusCode = 404;
      throw error;
    }
    return Profile;
  } catch (error) {
    throw error;
  }
};
