import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
       const connection =  await mongoose.connect(ENV.DB_URL);
        console.log("✅ Database connected: ", connection.connection.host);
    } catch (error) {
        console.error("❌ Database connection error: ", error);
        process.exit(1);
    }
}