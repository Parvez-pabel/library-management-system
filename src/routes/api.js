import express from "express";
import {
  login,
  profile,
  register,
  resendOTP,
  verifyOTP,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/registration", register);
UserRouter.post("/registration/:email/:otp", verifyOTP);
UserRouter.post("/resend-otp/:email", resendOTP);
UserRouter.post("/login", login);
UserRouter.get("/profile", protect, profile);

export default UserRouter;
