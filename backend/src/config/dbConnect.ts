import mongoose from "mongoose";
import "dotenv/config";

const dbConnect = async () => {
  const mongoUrl = process.env.MONGOURL;
  if (!mongoUrl) throw new Error("MONGOURL is not defined in environment variables");
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connected");
  } catch (error) {
    throw new Error("MongoDB connection error: " + error);
  }
};

export default dbConnect;
