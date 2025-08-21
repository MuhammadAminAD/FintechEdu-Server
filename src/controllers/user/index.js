import User from "../../models/User.js"

class Profile {
    async profile(req, res) {
        let userId = req.params.id
        let user
        try {
            if (userId) {
                user = await User.findById(userId, { password: 0 }).lean()
            }
            else {
                user = await User.findById(req.user._id, { password: 0 }).lean()
            }

            if (!user) {
                req.status(400).json({ ok: false, error_message: "Bad request" })
            }

            res.status(200).send({ ok: true, user })
        } catch (error) {
            console.error(error);
            res.status(500).json({ ok: false, error: error.message });
        }
    }
}