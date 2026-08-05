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





// import express from "express";
// import cors from "cors";

// const app = express();
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// app.use(
//   cors({
//     origin:
//       process.env.CORS_ORIGIN?.split(",") ||
//       "http://localhost:3000" || "https://rentease-cyan.vercel.app",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })

// );

// import connectDB from "./db/database.js";

// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// import healthCheckRouter from "./routes/healthcheck.routes.js";
// import userRouter from "./routes/user.routes.js";

// app.use("/api/v1/healthcheck", healthCheckRouter);
// app.use("/api", userRouter);

// app.get("/", (req, res) => {
//   res.send("Rentease Backend Server Connected");
// });

// app.use((err: any, req: any, res: any, next: any) => {
//   console.error(err);
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });


// export default app;


import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 1. Dynamic origins array
const allowedOrigins = [
  "http://localhost:3000",
  "https://rentease-cyan.vercel.app",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
];

// 2. Global CORS middleware (Handles both standard requests AND OPTIONS preflights automatically)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, server-to-server, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked request from: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

import connectDB from "./db/database.js";

// 3. Database Connection Middleware
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

// 4. API Routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import roommateRouter from "./routes/roommate.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api", userRouter);
app.use("/api", roommateRouter);

app.get("/", (req, res) => {
  res.send("Rentease Backend Server Connected");
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;