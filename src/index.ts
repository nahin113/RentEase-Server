// import dotenv from "dotenv";
// import app from "../src/app.js";
// import connectDB from "../src/db/database.js";

// dotenv.config({
//   path: "./.env",
// });

// // const port = process.env.PORT || 5000;

// // connectDB().then(()=> {
// //   app.listen(port, () => {
// //   console.log(`Example app listening on port ${port}`);
// // });
// // }).catch(err => {
// //   console.error("MongoDB connection error", err)
// //   process.exit(1)
// // })

// connectDB()

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/database.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();