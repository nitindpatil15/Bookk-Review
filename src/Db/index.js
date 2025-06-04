import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constant.js";

const connectDb = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }

        // Log the connection string for debugging (optional, be cautious with sensitive data)
        console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);

        const connect = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected!! DB Host: ${connect.connection.host}`);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        // Optionally exit the process if the connection fails
        process.exit(1);
    }
};

export default connectDb;
