import app from "../dist/app.js";
import connectDB from "../dist/db/database.js";

connectDB().catch((err) => console.error("MongoDB connection error:", err));

export default app;