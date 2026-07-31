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
import app from "../src/app.js";
import connectDB from "../src/db/database.js";

dotenv.config();

const handler = async (req: any, res: any) => {
    try {
        await connectDB();

        return app(req, res);
    } catch (error) {
        console.error("Server initialization error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default handler;