import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constant.js";

const connectDb = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);

        const connect = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected!! DB Host: ${connect.connection.host}`);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDb;
