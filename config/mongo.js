import mongoose from "mongoose";

export async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("📦 MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
  }
}
