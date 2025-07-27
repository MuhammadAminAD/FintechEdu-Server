import nodemailer from "nodemailer";
import { emailConfig } from "../configs/Mail.config.js";

export const sendEmail = async (email, code) => {
  const transporter = nodemailer.createTransport(emailConfig);

  const html = `
      <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#2E86C1;">Fintech edu</h2>
        <p>Hurmatli foydalanuvchi,</p>
        <p>Ro‘yxatdan o‘tishni yakunlash uchun quyidagi tasdiqlash kodidan foydalaning:</p>
        <div style="text-align:center; margin: 20px 0;">
          <span style="display:inline-block; padding:10px 20px; font-size:24px; background:#F4F6F6; border-radius:8px; border:1px solid #CCC;">
            <strong>${code}</strong>
          </span>
        </div>
        <p>⏳ Ushbu kod <strong>2 daqiqa</strong> ichida amal qiladi.</p>
        <p>Agar siz bu so‘rovni yubormagan bo‘lsangiz, iltimos, bu xabarni e'tiborsiz qoldiring.</p>
        <hr />
        <p style="font-size:12px; color:#888;">
          Fintech edu jamoasi tomonidan jo‘natildi. Qo‘shimcha yordam kerak bo‘lsa, biz bilan bog‘laning.
        </p>
      </div>
    `;

  const mailOptions = {
    from: `Fintech edu`,
    to: email,
    subject: "Fintech edu - Tasdiqlash kodi",
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('ok')
    return { ok: true, message: "Email muvaffaqiyatli jo'natildi" };
  } catch (error) {
    return {
      ok: false,
      error_message: "Email jo'natishda xatolik",
      error: error.message
    };
  }
};