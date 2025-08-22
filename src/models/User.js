import mongoose, { Schema } from 'mongoose';
import fs from "fs";
import path from "path";
const defaultImageBuffer = fs.readFileSync(
      path.join(process.cwd(), "public", "userDefaultImage.jpg")
);

const UserSchema = new Schema({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true, },
      gender: { type: String, enum: ['Male', 'Female', "no selected"], default: "no selected" },
      photo: { type: String, default: defaultImageBuffer },
      bio: { type: String, default: "" },
      state: { type: String },
      city: { type: String },
      date_birthday: { type: String },
      interest: { type: String }
});

export default mongoose.models['Users'] || mongoose.model('Users', UserSchema);