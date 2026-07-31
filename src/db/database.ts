// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         console.log(`MongoDB connected ! DB host : ${connectionInstance.connection.host}`)
//     } catch (error) {
//         console.error("MongoDB connection error", error)
//         process.exit(1)
//     }
// }

// export default connectDB

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined");
    }

    const connectionInstance = await mongoose.connect(
        `${mongoUri}/${DB_NAME}`
    );

    console.log(
        `MongoDB connected! DB host: ${connectionInstance.connection.host}`
    );
};

export default connectDB;