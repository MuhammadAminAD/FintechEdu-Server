import mongoose from "mongoose";
import { Schema } from "mongoose";

const BioSectionSchema = new Schema({
    name: { type: String, default: "" },
    value: { type: String }
}, { _id: false });

const BioSchema = new Schema({
    bio: { type: BioSectionSchema, default: () => ({ name: "bio", value: "" }) },
    who: { type: BioSectionSchema, default: () => ({ name: "Kurs kimlar uchun?", value: "" }) },
    what: { type: BioSectionSchema, default: () => ({ name: "Kursda nimalar o'rganiladi?", value: "" }) },
    requirement: { type: BioSectionSchema, default: () => ({ name: "Kurs talabi?", value: "" }) },
}, { _id: false });

const VideoSchema = new Schema({
    title: { type: String, required: true },
    bio: { type: String },
    id: { type: String }
}, { _id: false });

const ModuleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    videos: { type: [VideoSchema], default: [] }
});

const RatingSchema = new Schema({
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 },
    rating: { type: Number }
})


const Post = new Schema({
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    created_at: { type: Date, default: Date.now },
    name: { type: String, required: true },
    language: { type: String, default: "Uzbek" },
    bio: { type: BioSchema },
    level: { type: String },
    price: { type: Number, default: 0 },
    category: { type: String },
    subCategory: { type: String },
    cover: { type: String },
    keywords: { type: [String], default: [] },
    modules: { type: [ModuleSchema], default: [] },
    rating: { type: RatingSchema }
});

const PostModel = mongoose.models.Post || mongoose.model("Post", Post);

export default PostModel;
