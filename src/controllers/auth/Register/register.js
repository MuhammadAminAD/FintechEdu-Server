import AuthCode from "../../../models/AuthCode.js";
import User from "../../../models/User.js";
import { sendEmail } from "../../../services/Mail.service.js";
import generateCode from "../../../utils/GenerateCode.js";
import bcrypt from "bcrypt"

class RegisterController {
      async Step1(req, res) {
            const email = req.body.email;

            if (!email) {
                  return res.status(400).send({ ok: false, error_message: "Email manzili topilmadi" });
            }

            try {
                  const existingUser = await User.findOne({ email });

                  if (existingUser) {
                        return res.status(409).send({ ok: false, error_message: "Foydalanuvchi mavjud" });
                  } else {
                        return res.status(201).send({ ok: true, data: { email } });
                  }
            } catch (error) {
                  return res.status(500).send({ ok: false, error_message: "Server xatoligi", error: error.message });
            }
      }

      async Step2(req, res) {
            const email = req.body.email;

            if (!email) {
                  return res.status(400).send({ ok: false, error_message: "Email manzili topilmadi" });
            }

            const code = generateCode()

            try {
                  const result = await sendEmail(email, code);

                  if (result.ok) {
                        const newCode = new AuthCode({ code: code, email: email })
                        newCode.save()
                        return res.status(201).send({ ok: true, data: { email } });
                  } else {
                        return res.status(500).send({ ok: false, error_message: result.message });
                  }
            } catch (error) {
                  return res.status(500).send({ ok: false, error_message: "Server xatoligi", error: error.message });
            }
      }

      async Step3(req, res) {
            const email = req.body.email;
            const code = req.body.code;

            try {
                  const thisCode = await AuthCode.findOne({ email });

                  if (!thisCode) {
                        return res.status(404).json({
                              ok: false,
                              error_message: "Tasdiqlash kodi topilmadi yoki muddati o‘tgan"
                        });
                  }

                  if (thisCode.code !== code) {
                        return res.status(400).json({
                              ok: false,
                              error_message: "Kod noto‘g‘ri"
                        });
                  }
                  await AuthCode.deleteOne({ email });
                  return res.status(200).json({
                        ok: true,
                        message: "Kod muvaffaqiyatli tasdiqlandi",
                        data: { email: email }
                  });

            } catch (error) {
                  console.error("Step3 xatolik:", error);
                  return res.status(500).json({
                        ok: false,
                        message: "Serverda xatolik yuz berdi"
                  });
            }
      }

      async Step4(req, res) {
            const { firstName, lastName, email, password, gender } = req.body;

            // 🔒 Minimal validatsiya
            if (!firstName || !lastName || !email || !password || !gender) {
                  return res.status(400).send({
                        ok: false,
                        error_message: "Barcha maydonlar to‘ldirilishi kerak"
                  });
            }

            try {
                  const hashedPassword = await bcrypt.hash(password, 10);

                  const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        gender
                  });

                  await newUser.save();

                  return res.status(201).send({
                        ok: true,
                        message: "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi",
                        data: { email }
                  });

            } catch (error) {
                  console.error("Step4 xatolik:", error);
                  return res.status(500).send({
                        ok: false,
                        error_message: "Serverda xatolik yuz berdi",
                        error: error.message
                  });
            }
      }
}

export default new RegisterController();