import fs from "fs";
import { downloadTelegramVideo } from "../../utils/GetVedioToChannel.js";

class VideoController {
    async get(req, res) {
        try {
            const videoId = req.params.id;
            const videoPath = await downloadTelegramVideo(videoId, `${videoId}.mp4`);

            if (!fs.existsSync(videoPath))
                return res.status(404).json({ ok: false, error: "Video topilmadi" });

            const { size: fileSize } = fs.statSync(videoPath);
            const range = req.headers.range;

            res.on("finish", () => fs.unlink(videoPath, err =>
                err && console.error("❌ Video o‘chirishda xatolik:", err)
            ));

            const head = { "Content-Type": "video/mp4", "Accept-Ranges": "bytes" };

            if (range) {
                const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
                const start = parseInt(startStr, 10);
                const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
                head["Content-Range"] = `bytes ${start}-${end}/${fileSize}`;
                head["Content-Length"] = end - start + 1;
                res.writeHead(206, head);
                fs.createReadStream(videoPath, { start, end }).pipe(res);
            } else {
                head["Content-Length"] = fileSize;
                res.writeHead(200, head);
                fs.createReadStream(videoPath).pipe(res);
            }

        } catch (err) {
            console.error("❌ Video olishda xatolik:", err);
            res.status(500).json({ ok: false, error: "Video yuklab bo‘lmadi" });
        }
    }
}

export default new VideoController();
