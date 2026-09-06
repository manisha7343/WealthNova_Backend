const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config(); // Environment variables sabse pehle load hona zaroori hain

//--------------- External Modules & Connections -------------------------

const connectDB = require("./config/db");
const cors = require("cors");

// Connect Database
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Background Cron Jobs (dotenv aur DB ke baad require karein)
require("./jobs/loginAttemptsCron");
require("./jobs/stockSyncCron");

//---------------- Internal Routes ------------------

const auth = require("./routes/authRoutes");
const profile = require("./routes/userRoute");
const stockDetailRoutes = require("./routes/stockRoute");

// const stocks = require("./routes/stockRoute");

// Deployment setup (Render)
app.set("trust proxy", 1);

// ----------------------- MIDDLEWARES ------------------------------------------

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------- BASE ROUTES ------------------------------------

app.use("/api/auth", auth);
app.use("/api/user", profile);
app.use("/api/stocks", stockDetailRoutes);

//################## Global Error Handler ###########################
app.use((err, req, res, next) => {
  // Invalid JSON Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format in request body. Please check your syntax.",
    });
  }

  // Duplicate Key Error (MongoDB Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  // JWT Token Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired, please login again",
    });
  }

  res.status(500).json({ success: false, message: "Internal Server Error" });
});

//---------------------- Server Start Point ------------------------

app.get("/", (req, res) => {
  res.send("Stock Market & User Manager API running");
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;