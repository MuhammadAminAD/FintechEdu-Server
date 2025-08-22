import User from "../../models/User.js";
import fs from "fs"

class Profile {
    async profile(req, res) {
        try {
            const userId = req.params.id || req.user?._id;

            if (!userId) {
                return res.status(400).json({ ok: false, error_message: "User ID is required" });
            }

            const user = await User.findById(userId, { password: 0 }).lean();

            if (!user) {
                return res.status(404).json({ ok: false, error_message: "User not found" });
            }

            return res.status(200).json({ ok: true, user });
        } catch (error) {
            console.error(error);

            if (error.name === "CastError") {
                return res.status(400).json({ ok: false, error_message: "Invalid User ID format" });
            }

            return res.status(500).json({ ok: false, error: error.message });
        }
    }

    async update(req, res) {
        try {
            const userId = req.user?._id;
            const body = req.body
            const allowedChanges = ["firstName", "lastName", "gender", "photo", "bio", "state", "city", "date_birthday", "interest"]
            const updateData = {}

            for (let changeKey of allowedChanges) {
                if (body[changeKey] !== undefined) {
                    updateData[changeKey] = body[changeKey];
                }
            }

            if (req.file) {
                const mimeType = req.file.mimetype;
                const filePath = req.file.path;
                const fileBuffer = fs.readFileSync(filePath);
                const base64 = fileBuffer.toString("base64");
                const base64Image = `data:${mimeType};base64,${base64}`;
                updateData.photo = base64Image;
                fs.unlinkSync(filePath);
            }

            const user = await User.findByIdAndUpdate(userId, { ...updateData }, { new: true, projection: { password: 0 } }).lean();

            if (!user) {
                return res.status(404).json({ ok: false, error_message: "User not found" });
            }

            return res.status(200).json({ ok: true, user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ ok: false, error: error.message });
        }
    }

    
}
export default new Profile();