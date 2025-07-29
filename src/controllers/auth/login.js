import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/GenerateToken.js";

async function login(req, res) {
      const { email, password } = req.body;

      const errors = {};
      if (!email) errors.email = "Email manzili kiritilishi kerak";
      if (!password) errors.password = "Parol kiritilishi kerak";

      if (Object.keys(errors).length > 0) {
            return res.status(400).send({ ok: false, errors });
      }

      try {
            const user = await User.findOne({ email: email });
            if (!user) {
                  return res.status(404).send({
                        ok: false,
                        errors: { email: "Bunday foydalanuvchi topilmadi" }
                  });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                  return res.status(400).send({
                        ok: false,
                        errors: { password: "Parol noto‘g‘ri" }
                  });
            }
            const token = {
                  accessToken: generateAccessToken({ email, id: user._id }),
            }
            const refreshToken = generateRefreshToken({ email, id: user._id })

            res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "Strict",
                  maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).send({
                  ok: true,
                  message: "Tizimga muvaffaqiyatli kirdingiz",
                  data: {
                        email: user.email,
                        token: token
                  }
            });
      } catch (error) {
            console.error("Login xatolik:", error);
            return res.status(500).send({
                  ok: false,
                  error_message: "Serverda xatolik yuz berdi",
                  error: error.message
            });
      }
}

export default login;
