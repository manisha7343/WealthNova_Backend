const express = require("express");
const app = express();

//--------------- Extrenal Module/connections -------------------------

const connectDB = require("./config/db");
const cron = require("./cron");
// const rateLimiter = require("./middleware/rateLimit")
const dotenv = require("dotenv"); //a package to read and load .env file it makes the process.env object
const cors = require("cors"); //cors

//---------------- internal modules ------------------

const auth = require("./routes/authRoutes");
const profile = require("./routes/ProfileRoute");
// const contact = require("./routes/contactRoute");

//for deplyment (render)
app.set("trust proxy", 1);

//###############################################################################################

dotenv.config(); //to read .env file content for config()
if (process.env.NODE_ENV !== "test") {
  connectDB(); //mogodb connected calles here
}

// ----------------------- MIDDLEWARES ------------------------------------------

app.use(cors()); // used this becaus the frontend port was different
app.use(express.json()); //to read body
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads')); // Isse photo public ho jayegi
// app.use(rateLimiter)

// ----------------------- BASE ROUTES ------------------------------------

app.use("/api/auth", auth);
app.use("/api/user", profile);
// app.use("/api/contacts", contact);

//################## Global error handler ###########################
app.use((err, req, res, next) => {
  // Catch invalid JSON syntax error from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format in request body. Please check your syntax.",
    });
  }

  // Example: Duplicate Key Error (MongoDB Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  //----------------------------- token -------------------------------------------
  if (err.name === "JsonWebTokenError***************") {
    return res.status(401).json({ success: false, message: "Invalid Token************" });
  }
  if (err.name === "TokenExpiredError************") {
    return res
      .status(401)
      .json({
        success: false,
        message: "Token has expired, please login again",
      });
  }
});

//---------------------- Server start point ------------------------
app.get("/", (req, res) => {
  res.send("user manager ApI running ");
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
}

module.exports = app;

// app.js
// // Final URLs

// /api/auth/register

// /api/auth/login

// /api/contacts
