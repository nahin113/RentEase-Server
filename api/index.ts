import app from "../src/app.ts";
import connectDB from "../src/db/database.ts";

connectDB().catch((err) => console.error("MongoDB connection error:", err));

export default app;