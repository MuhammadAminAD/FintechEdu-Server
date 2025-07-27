import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/GenerateToken.js";

export const refreshAccessToken = (req, res) => {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
            return res.status(401).json({
                  ok: false,
                  error_message: "Refresh token topilmadi"
            });
      }

      try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

            const accessToken = generateAccessToken({
                  id: decoded.id,
                  email: decoded.email
            });

            return res.status(200).json({
                  ok: true,
                  message: "Yangi access token berildi",
                  token: { accessToken }
            });

      } catch (error) {
            return res.status(403).json({
                  ok: false,
                  error_message: "Yaroqsiz yoki muddati tugagan refresh token"
            });
      }
};
