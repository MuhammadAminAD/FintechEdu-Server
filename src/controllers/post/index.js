import Post from "../../models/Post.js";
import { sendVedio } from "../../utils/SendVedioToChannel.js";
import fs from "fs/promises";

class PostsController {
    async createPost(req, res) {
        const data = req.body;
        const files = req.files || [];
        const creatorId = req.user.id;
        let tempUploadedFiles = [];
        console.log(files)
        try {
            if (typeof data.modules === "string") data.modules = JSON.parse(data.modules);
            if (typeof data.keywords === "string") data.keywords = JSON.parse(data.keywords);

            data.creatorId = creatorId;

            await Promise.all(
                data.modules.map(async (module) => {
                    await Promise.all(
                        module.videos.map(async (video) => {
                            const file = files.find(f => f.fieldname === video.vedioName);
                            if (!file) throw new Error(`File not found for video: ${video.vedioName}`);

                            const fileId = await sendVedio(file.filename);
                            video.id = fileId;
                            tempUploadedFiles.push(file.filename)

                            try {
                                await fs.unlink(`./uploads/${file.filename}`);
                            } catch (unlinkErr) {
                                console.warn(`⚠️ Could not delete file: ${file.filename}`, unlinkErr);
                            }
                        })
                    );
                })
            );

            const savedPost = new Post({ ...data, price: data.price ? Number(data.price) : 0 });
            await savedPost.save();

            res.send({ ok: true });
        } catch (err) {
            console.error("❌ Xatolik:", err);
            Promise.all(
                tempUploadedFiles.map((filename) =>
                    fs.unlink(`./uploads/${filename}`).catch(() => { })
                )
            )
            res.status(500).send({
                ok: false,
                error_message: "Serverda xatolik yuz berdi",
                error: err.message
            });
        }
    }

    async getById(req, res) {
        try {
            const postId = req.params.id;
            if (!postId) return res.status(400).json({ ok: false, error_message: "Post ID kiritilmadi" });

            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ ok: false, error_message: "Post topilmadi" });

            res.status(200).json({ ok: true, data: post });
        } catch (error) {
            console.error("❌ getById xatolik:", error);
            res.status(500).json({ ok: false, error_message: "Server xatosi" });
        }
    }

    async getAll(req, res) {
        console.log("salom")
        const {
            limit = 10,
            category = "",
            subCategory = "",
            search = "",
            language = "",
            skip = 0,
            rating, // 4.5-5
            price,
        } = req.query;

        let filterPrice = {}
        let ratingFilter = {}
        if (price) {
            filterPrice = { price: price.toLowerCase() === "price increase" ? 1 : -1 }
        }

        if (rating) {
            const [minRating, maxRating] = rating.split("-").map(Number);
            ratingFilter = { "rating.rating": { $gte: minRating, $lte: maxRating } };
        }

        try {
            const posts = await Post.find({
                category: { $regex: category, $options: "i" },
                subCategory: { $regex: subCategory, $options: "i" },
                language: { $regex: language, $options: "i" },
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { keywords: { $in: [new RegExp(search, "i")] } }
                ],
                ...ratingFilter

            }, { language: 0, created_at: 0, level: 0, category: 0, subCategory: 0, keywords: 0, modules: 0 })
                .skip(Number(skip))
                .limit(Number(limit))
                .sort(filterPrice);

            res.status(200).json({ ok: true, data: posts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ ok: false, error: error.message });
        }
    }

}

export default new PostsController();



// const req = {
//     body: {
//         name: 'Frontend kurslari',
//         language: 'Uzbek',
//         level: 'beginer',
//         price: '100000',
//         cover: "cover",
//         category: 'It',
//         subCategory: 'Frontend',
//         keywords: '["frontend",  "dars" , "vedio"]',
//         modules: [
//             {
//                 title: "1-modul",
//                 description: "Kirish",
//                 vedios: [
//                     {
//                         title: "Ustoz bilan tanishuv",
//                         bio: "Bu darsda biz ustoz bilan yaqidan tanishamiz.",
//                         vedioName: "1-vedio",
//                     },
//                     {
//                         title: "Dasturlas ozi nima",
//                         bio: "Dasturlash asoslarini korib chiqish.",
//                         vedioName: "2-vedio",
//                     }
//                 ]
//             },
//             {
//                 title: "2-modul",
//                 description: "HTML",
//                 vedios: [
//                     {
//                         title: "div",
//                         bio: "Div ochish",
//                         vedioName: "3-vedio",
//                     },
//                     {
//                         title: "p , h1 ,h2.... ",
//                         bio: "textlar bilan ishlash",
//                         vedioName: "4-vedio",
//                     }
//                 ]
//             },
//         ]
//     },
//     files: [
//         {
//             fieldname: 'cover',
//             originalname: 'Screenshot 2025-07-19 180527.png',
//             encoding: '7bit',
//             mimetype: 'image/png',
//             destination: 'uploads/',
//             filename: '3b30d7acccc302ede3263cc12c2e4daa',
//             path: 'uploads\\3b30d7acccc302ede3263cc12c2e4daa',
//             size: 368361
//         },
//         {
//             fieldname: '1-vedio',
//             originalname: 'Recording 2025-08-07 103206.mp4',
//             encoding: '7bit',
//             mimetype: 'video/mp4',
//             destination: 'uploads/',
//             filename: '046e4c20f7ed5ff9e8efc1076de1fe23',
//             path: 'uploads\\046e4c20f7ed5ff9e8efc1076de1fe23',
//             size: 11155687
//         },
//         {
//             fieldname: '2-vedio',
//             originalname: 'Recording 2025-08-07 103206.mp4',
//             encoding: '7bit',
//             mimetype: 'video/mp4',
//             destination: 'uploads/',
//             filename: '046e4c20f7ed5ff9e8efc1076de1fe23',
//             path: 'uploads\\046e4c20f7ed5ff9e8efc1076de1fe23',
//             size: 11155687
//         },
//         {
//             fieldname: '3-vedio',
//             originalname: 'Recording 2025-08-07 103206.mp4',
//             encoding: '7bit',
//             mimetype: 'video/mp4',
//             destination: 'uploads/',
//             filename: '046e4c20f7ed5ff9e8efc1076de1fe23',
//             path: 'uploads\\046e4c20f7ed5ff9e8efc1076de1fe23',
//             size: 11155687
//         },
//         {
//             fieldname: '4-vedio',
//             originalname: 'Recording 2025-08-07 103206.mp4',
//             encoding: '7bit',
//             mimetype: 'video/mp4',
//             destination: 'uploads/',
//             filename: '046e4c20f7ed5ff9e8efc1076de1fe23',
//             path: 'uploads\\046e4c20f7ed5ff9e8efc1076de1fe23',
//             size: 11155687
//         }
//     ]
// }