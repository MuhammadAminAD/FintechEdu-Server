import User from "../../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/GenerateToken.js";

export const authGoogle = async (req, res) => {
      const email = req.user?.emails?.[0]?.value;
      const firstName = req.user?.name?.givenName;
      const lastName = req.user?.name?.familyName;

      try {
            const isExist = await User.findOne({ email })

            if (isExist) {

                  const accessToken = generateAccessToken({ email, id: isExist._id })
                  const refreshToken = generateRefreshToken({ email, id: isExist._id })
                  res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict",
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                  });
                  res.redirect(`${process.env.CLIENT_URL}/googleAuth?token=${accessToken}&email=${email}`);
            }

            else {
                  const user = new User({ email, firstName, lastName, password: "google-auth" })
                  user.save()
                  const accessToken = generateAccessToken({ email, id: newUser._id });
                  const refreshToken = generateRefreshToken({ email, id: newUser._id });

                  res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict",
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                  });
                  res.redirect(`${process.env.CLIENT_URL}/googleAuth?token=${accessToken}&email=${email}`);
            }
      } catch (error) {
            console.error("google auth xatolik:", error);
            return res.status(500).send({
                  ok: false,
                  error_message: "Serverda xatolik yuz berdi",
                  error: error.message
            });
      }
}