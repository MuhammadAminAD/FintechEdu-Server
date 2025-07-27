import mongoose from "mongoose";

const AuthCodeSchema = new mongoose.Schema({
      code: {
            type: String,
            required: true,
            trim: true
      },
      email: {
            type: String,
            required: true,
            trim: true,
      },
      createdAt: {
            type: Date,
            default: Date.now,
            expires: 120
      }
});

export default mongoose.models["AuthCode"] || mongoose.model("AuthCode", AuthCodeSchema)