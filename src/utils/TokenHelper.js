import jwt from "jsonwebtoken";

export const CreateToken = async (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const DecodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
