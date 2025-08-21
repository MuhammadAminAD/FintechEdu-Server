import axios from 'axios';
import path from 'path';
import fs from "fs";
import fsp from "fs/promises";

export async function downloadTelegramVideo(fileId, saveFileName) {
    try {
        const fileInfo = await axios.get(
            `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`
        );

        const filePath = fileInfo.data.result.file_path;
        const ext = path.extname(filePath) || ".mp4"; 
        const savePath = path.join('./downloads', saveFileName + ext);

        if (!fs.existsSync('./downloads')) {
            await fsp.mkdir('./downloads', { recursive: true });
        }

        const fileUrl = `https://api.telegram.org/file/bot${process.env.TG_BOT_TOKEN}/${filePath}`;
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log('✅ Video muvaffaqiyatli yuklab olindi:', savePath);
                resolve(savePath);
            });
            writer.on('error', (err) => {
                console.error('❌ Yuklab olishda xatolik:', err);
                reject(err);
            });
        });

    } catch (err) {
        console.error("❌ Xatolik yuz berdi:", err);
    }
}
