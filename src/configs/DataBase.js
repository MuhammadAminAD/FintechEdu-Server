import mongoose from "mongoose"


export const connectDataBase = async () => {
      try {
            await mongoose.connect(process.env.DB_URI)
            console.log("✅ MongoDB successfully connected");
      } catch (error) {
            console.log("❌ MongoDB connection error:", error.message);
      }
}