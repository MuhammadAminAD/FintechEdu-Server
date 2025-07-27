import dotenv from 'dotenv';
dotenv.config();

export const emailConfig = {
      service: "gmail",
      auth: {
            user: process.env.GOOGLE_APP_EMAIL,
            pass: process.env.GOOGLE_APP_PASSWORD
      }
};