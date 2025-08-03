import nodemailer from "nodemailer";
import { emailConfig } from "../configs/MailConfig.js";

/**
 * @param {string} email - Qabul qiluvchi email manzil
 * @param {string} code - Tasdiqlash kodi
 * @param {"register" | "reset"} type - Xat turini aniqlovchi parametr
 */
export const sendEmail = async (email, code, type = "register") => {
  const transporter = nodemailer.createTransport(emailConfig);

  const title = "Fintech edu";

  // Matnni turiga qarab aniqlaymiz
  const description =
    type === "reset"
      ? "Parolingizni tiklash uchun quyidagi tasdiqlash kodidan foydalaning:"
      : "Ro‘yxatdan o‘tishni yakunlash uchun quyidagi tasdiqlash kodidan foydalaning:";

  const subject =
    type === "reset"
      ? "Fintech edu - Parolni tiklash kodi"
      : "Fintech edu - Ro‘yxatdan o‘tish kodi";

  const html = `
    <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
      <h2 style="color:#2E86C1;">${title}</h2>
      <p>Hurmatli foydalanuvchi,</p>
      <p>${description}</p>
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
    from: title,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email yuborildi:", email);
    return { ok: true, message: "Email muvaffaqiyatli jo'natildi" };
  } catch (error) {
    return {
      ok: false,
      error_message: "Email jo'natishda xatolik",
      error: error.message,
    };
  }
};
