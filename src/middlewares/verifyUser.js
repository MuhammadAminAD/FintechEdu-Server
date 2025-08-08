import JWT from "jsonwebtoken";
import User from "../models/User.js";

export const VerifyUser = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({ ok: false, error_message: "Token topilmadi" });
    }

    try {
        const data = JWT.verify(accessToken, process.env.JWT_SECRET);
        const userId = data.id;
        if (!userId) {
            return res.status(401).json({ ok: false, error_message: "Noto‘g‘ri token" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ ok: false, error_message: "Foydalanuvchi topilmadi" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ ok: false, error_message: "Token yaroqsiz yoki muddati o‘tgan" });
    }
};