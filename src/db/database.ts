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

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) return;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is not defined");

  const conn = await mongoose.connect(`${mongoUri}/${DB_NAME}`);
  isConnected = true;
  console.log(`MongoDB connected! DB host: ${conn.connection.host}`);
};

export default connectDB;