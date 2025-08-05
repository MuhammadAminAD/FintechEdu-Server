import AuthCode from "../../models/AuthCode.js";
import User from "../../models/User.js";
import { sendEmail } from "../../services/Mail.service.js";
import generateCode from "../../utils/GenerateCode.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/GenerateToken.js";
import jwt from 'jsonwebtoken';

class RegisterController {
      async request(req, res) {
            const { email } = req.body;

            if (!email) {
                  return res.status(400).send({
                        ok: false,
                        errors: { email: "Email manzili kiritilishi kerak" }
                  });
            }

            try {
                  const existingUser = await User.findOne({ email: email });

                  if (existingUser) {
                        return res.status(409).send({
                              ok: false,
                              errors: { email: "Bunday foydalanuvchi allaqachon mavjud" }
                        });
                  }

                  const code = generateCode();
                  const result = await sendEmail(email, code);

                  if (!result.ok) {
                        return res.status(500).send({
                              ok: false,
                              error_message: result.message
                        });
                  }

                  await AuthCode.deleteMany({ email: email });
                  const newCode = new AuthCode({ code: code, email: email });
                  await newCode.save();

                  return res.status(201).send({
                        ok: true,
                        message: "Email manzil tekshirildi va kod yuborildi",
                        data: { email: email }
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

            if (!email || !code) {
                  const errors = {};
                  if (!email) errors.email = "Email manzili kerak";
                  if (!code) errors.code = "Tasdiqlash kodi kerak";

                  return res.status(400).json({ ok: false, errors });
            }

            try {
                  const thisCode = await AuthCode.findOne({ email });

                  if (!thisCode) {
                        return res.status(404).json({
                              ok: false,
                              errors: { code: "Tasdiqlash kodi topilmadi yoki muddati o‘tgan" }
                        });
                  }

                  if (thisCode.code !== code) {
                        return res.status(400).json({
                              ok: false,
                              errors: { code: "Kod noto‘g‘ri" }
                        });
                  }

                  const verifyToken = generateAccessToken({ email })
                  await AuthCode.deleteOne({ email });


                  res.cookie("verifyToken", verifyToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict",
                        maxAge: 60 * 5000,
                  });

                  return res.status(200).json({
                        ok: true,
                        message: "Kod muvaffaqiyatli tasdiqlandi",

                  });
            } catch (error) {
                  console.error("Step3 xatolik:", error);
                  return res.status(500).json({
                        ok: false,
                        error_message: "Serverda xatolik yuz berdi",
                        error: error.message
                  });
            }
      }

      async create(req, res) {
            const verifyToken = req.cookies?.verifyToken
            const { firstName, lastName, email, password, gender } = req.body;

            const errors = {};
            if (!firstName) errors.firstName = "Ism kiritilishi kerak";
            if (!lastName) errors.lastName = "Familiya kiritilishi kerak";
            if (!email) errors.email = "Email manzili kerak";
            if (!password) errors.password = "Parol kiritilishi kerak";
            if (!gender) errors.gender = "Jins tanlanishi kerak";
            if (!verifyToken) errors.password = "xafsizlik uchun malumotlar 5 daqiqa ichida kiritilishi kerak. Iltimos qayta urinib koring"

            if (Object.keys(errors).length > 0) {
                  return res.status(400).send({ ok: false, errors });
            }


            try {
                  const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET);

                  if (decoded.email !== email) {
                        return res.status(403).send({
                              ok: false,
                              errors: { email: "Tasdiqlangan email bilan mos emas. Qayta ro‘yxatdan o‘ting." }
                        });
                  }

                  const existingUser = await User.findOne({ email });
                  if (existingUser) {
                        return res.status(409).send({
                              ok: false,
                              errors: { email: "Bu email bilan foydalanuvchi allaqachon mavjud" }
                        });
                  }

                  const hashedPassword = await bcrypt.hash(password, 10);

                  const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        gender
                  });

                  await newUser.save();

                  const accessToken = generateAccessToken({ email, id: newUser._id });
                  const refreshToken = generateRefreshToken({ email, id: newUser._id });

                  res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict",
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                  });
                  res.clearCookie("verifyToken");

                  return res.status(201).send({
                        ok: true,
                        message: "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi",
                        data: {
                              email,
                              token: { accessToken }
                        }
                  });
            } catch (error) {
                  console.error("create() xatolik:", error);
                  return res.status(500).send({
                        ok: false,
                        error_message: "Serverda xatolik yuz berdi",
                        error: error.message
                  });
            }
      }

}

export default new RegisterController();
