import Post from "../../models/Post.js"

class VideoController {
    async get(req, res) {
        const postId = req.params.id
        const videoId = req.params.video
        try {
            const modules = Post.findById(postId, { modules: 1 })
            const video = modules.filter((module) => module.videos.find((video) => vedio.id === videoId))
            res.status(200).json({ ok: true, data: video })
        } catch (error) {

        }
    }
}

export default new VideoController()