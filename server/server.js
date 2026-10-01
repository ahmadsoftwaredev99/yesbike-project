import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database on startup for local standalone server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`YES BIKE API server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });
