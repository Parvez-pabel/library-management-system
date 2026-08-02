import userModel from "../models/userModel.js";
import { generateOTP, getOtpExpiryTime } from "../utils/otpHelper.js";
import { paginate } from "../utils/paginate.js";
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
// profile update
export const profileUpdateService = async (req, res) => {
  try {
    const userID = req.user.userID;
    let reqBody = { ...req.body };

    delete reqBody.email;
    delete reqBody.password;
    delete reqBody.role;
    delete reqBody.status;
    delete reqBody.otp;
    delete reqBody.otpExpiry;

    let updatedProfile = userModel
      .findByIdAndUpdate(
        { _id: userID },
        { $set: reqBody },
        { new: true, runValidators: true },
      )
      .select("-password -otp -otpExpiry");
    if (!updatedProfile) {
      const error = new Error("User profile not found.");
      error.statusCode = 404;
      throw error;
    }
    return updatedProfile;
  } catch (error) {
    throw error;
  }
};

//forget password
//reset password

//admin activities
export const DeleteService = async (req) => {
  try {
    const userID = req.params.id;
    const currentUserRole = req.user?.role;
    const currentUserID = req.user?.userID;

    if (!userID) {
      const error = new Error("User ID is required in request parameters.");
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
    if (currentUserID.toString() === userID.toString()) {
      const error = new Error(
        "Admin cannot delete their own account using this route.",
      );
      error.statusCode = 400;
      throw error;
    }
    const deletedUser = await userModel.findByIdAndDelete(userID);

    if (!deletedUser) {
      const error = new Error("User not found with the provided ID.");
      error.statusCode = 404;
      throw error;
    }
    const userObj = deletedUser.toObject();
    delete userObj.password;
    delete userObj.otp;

    return userObj;
  } catch (error) {
    throw error;
  }
};
// all profile
export const getAllProfileService = async (req) => {
  try {
    const { search, role } = req.query;
    const filter = {};
    if (role) {
      filter.role = role;
    }

    //search by name, number, email
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }
    const profiles = await paginate({
      model: userModel,
      reqQuery: req.query,
      customFilter: filter,
      selectFields: "_id name email phone role status photo",
    });
    return profiles;
  } catch (error) {
    throw error;
  }
};
export const profileUpdateByIdService = async (req, res) => {
  try {
    const userID = req.params.id;
    let reqBody = { ...req.body };

    delete reqBody.status;
    delete reqBody.otp;
    delete reqBody.otpExpiry;

    let updatedProfile = userModel
      .findByIdAndUpdate(
        { _id: userID },
        { $set: reqBody },
        { new: true, runValidators: true },
      )
      .select("-password -otp -otpExpiry");
    if (!updatedProfile) {
      const error = new Error("User profile not found.");
      error.statusCode = 404;
      throw error;
    }
    return updatedProfile;
  } catch (error) {
    throw error;
  }
};

//logout
