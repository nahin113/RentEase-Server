// import express from "express";
// import cors from "cors";

// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// // app.use(express.static("public")) this is for making a folder publicly available 


// app.use(cors({
//   origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }))

// // import the routes
// import healthCheckRouter from "./routes/healthcheck.routes.js"
// import userRouter from "./routes/user.routes.js"

// app.use("/api/v1/healthcheck", healthCheckRouter)
// app.use("/api", userRouter)

// // Root route
// app.get("/", (req, res) => {
//   res.send("Rentease Backend Server Connected");
// });

// export default app;


import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN?.split(",") ||
      "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import connectDB from "./db/database.js";

app.use(async (req, res, next) => {
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