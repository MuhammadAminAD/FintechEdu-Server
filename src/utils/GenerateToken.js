import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload) => {
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};
