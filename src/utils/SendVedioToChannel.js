import * as fs from 'fs'; 
import bot from "../configs/Bot.js";

export async function sendVedio(VdName) {
    try {
        const message = await bot.telegram.sendVideo(process.env.TG_CHANNEL_USERNAME, {
            source: fs.createReadStream(`./uploads/${VdName}`)
        });
        const vedioId = message.video.file_id
        console.log(vedioId)
        return vedioId
    } catch (err) {
        console.error("❌ Video yuborishda xatolik:", err);
    }
}