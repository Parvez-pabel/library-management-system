import express from "express";
import {
  getAllProfile,
  login,
  profile,
  profileDelete,
  profileUpdate,
  profileUpdateAdmin,
  register,
  resendOTP,
  userBorrowedBook,
  verifyOTP,
} from "../controllers/userController.js";
import { authRole, protect } from "../middleware/authMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/registration", register);
UserRouter.post("/registration/:email/:otp", verifyOTP);
UserRouter.post("/resend-otp/:email", resendOTP);
UserRouter.post("/login", login);
UserRouter.get("/profile", protect, profile);
UserRouter.put("/profile/update", protect, profileUpdate);

//admin activity route
UserRouter.delete(
  "/profile/delete/:id",
  protect,
  authRole("Admin"),
  profileDelete,
);
UserRouter.get("/all-profile", protect, authRole("Admin"), getAllProfile);
UserRouter.get(
  "/user-borrowed-book/:id",
  protect,
  authRole("Admin"),
  userBorrowedBook,
);
UserRouter.put(
  "/profile/update/:id",
  protect,
  authRole("Admin"),
  profileUpdateAdmin,
);

export default UserRouter;
