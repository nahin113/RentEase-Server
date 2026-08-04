// // import express from "express";
// // import cors from "cors";

// // const app = express();

// // // Middleware to parse JSON bodies
// // app.use(express.json({ limit: "16kb" }));
// // app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// // // app.use(express.static("public")) this is for making a folder publicly available 


// // app.use(cors({
// //   origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
// //   credentials: true,
// //   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
// //   allowedHeaders: ["Content-Type", "Authorization"]
// // }))

// // // import the routes
// // import healthCheckRouter from "./routes/healthcheck.routes.js"
// // import userRouter from "./routes/user.routes.js"

// // app.use("/api/v1/healthcheck", healthCheckRouter)
// // app.use("/api", userRouter)

// // // Root route
// // app.get("/", (req, res) => {
// //   res.send("Rentease Backend Server Connected");
// // });

// // export default app;


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

// 1. Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://rentease-cyan.vercel.app",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
];

// 2. Dynamic CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Explicitly handle preflight OPTIONS requests across all routes
app.options("*", cors());

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