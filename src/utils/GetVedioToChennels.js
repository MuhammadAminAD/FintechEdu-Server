import axios from 'axios';
import path from 'path';
import fs from "fs/promises"

export async function downloadTelegramVideo(fileId, saveFileName) {
    try {
        const fileInfo = await axios.get(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`);
        const filePath = fileInfo.data.result.file_path;

        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        const savePath = path.join('./downloads', saveFileName);

        if (!fs.existsSync('./src/downloads')) {
            fs.mkdirSync('./src/downloads');
        }

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