import User from "../../models/User.js";
import AuthCode from "../../models/AuthCode.js";
import { sendEmail } from "../../services/Mail.service.js";
import generateCode from "../../utils/GenerateCode.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/GenerateToken.js";

class ResetPasswordController {
      async request(req, res) {
            const { email } = req.body;

            if (!email) {
                  return res.status(400).send({
                        ok: false,
                        errors: { email: "Email manzili kiritilishi kerak" }
                  });
            }

            try {
                  const user = await User.findOne({ email });
                  if (!user) {
                        return res.status(404).send({
                              ok: false,
                              errors: { email: "Bunday foydalanuvchi topilmadi" }
                        });
                  }

                  const code = generateCode();
                  const result = await sendEmail(email, code, "reset");

                  if (!result.ok) {
                        return res.status(500).send({
                              ok: false,
                              error_message: result.message
                        });
                  }

                  await AuthCode.deleteMany({ email: email });
                  await new AuthCode({ email: email, code: code }).save();

                  return res.status(200).send({
                        ok: true,
                        message: "Tasdiqlash kodi emailga yuborildi",
                        data: { email: email, token }
                  });
            } catch (error) {
                  return res.status(500).send({
                        ok: false,
                        error_message: "Server xatoligi",
                        error: error.message
                  });
            }
      }

      async verify(req, res) {
            const { email, code } = req.body;

            const errors = {};
            if (!email) errors.email = "Email manzili kiritilishi kerak";
            if (!code) errors.code = "Kod kiritilishi kerak";

            if (Object.keys(errors).length > 0) {
                  return res.status(400).send({ ok: false, errors });
            }

            try {
                  const record = await AuthCode.findOne({ email });
                  if (!record || record.code !== code) {
                        return res.status(400).send({
                              ok: false,
                              errors: { code: "Kod noto‘g‘ri yoki muddati o‘tgan" }
                        });
                  }

                  await AuthCode.deleteMany({ email });
                  return res.status(200).send({
                        ok: true,
                        message: "Kod to‘g‘ri tasdiqlandi",
                        data: { email }
                  });
            } catch (error) {
                  return res.status(500).send({
                        ok: false,
                        error_message: "Server xatoligi",
                        error: error.message
                  });
            }
      }

      async complete(req, res) {
            const { email, newPassword } = req.body;

            const errors = {};
            if (!email) errors.email = "Email manzili kerak";
            if (!newPassword) errors.newPassword = "Yangi parol kerak";

            if (Object.keys(errors).length > 0) {
                  return res.status(400).send({ ok: false, errors });
            }

            try {
                  const hashedPassword = await bcrypt.hash(newPassword, 10);
                  const user = await User.updateOne({ email }, { password: hashedPassword }, { new: true });


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
                        message: "Parol muvaffaqiyatli yangilandi",
                        data: { token: { accessToken } }
                  });
            } catch (error) {
                  return res.status(500).send({
                        ok: false,
                        error_message: "Server xatoligi",
                        error: error.message
                  });
            }
      }
}

export default new ResetPasswordController();
