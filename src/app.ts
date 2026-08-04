import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 1. Allowed origins list
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://rentease-cyan.vercel.app", // Added your deployed frontend
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
];

// 2. CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server) or matching origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 🔴 FIX: Use /(.*) instead of "*" to prevent path-to-regexp crash in Express
app.options("/(.*)", cors());

import connectDB from "./db/database.js";

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Rentease Backend Server Connected");
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;