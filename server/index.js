const express = require("express");
const colors = require("colors");
const nodemailer = require("nodemailer");
const cors = require("cors");
const cron = require("node-cron");
const dotenv = require("dotenv"); // Note that you might often see dotenv.config() invoked immediately like this.
const cookieParser = require("cookie-parser");
const dbConnection = require("./database/dbcon.js");
const jobsRouterCollection = require("./routers/jobs.Routes.js");
const userrouter = require("./routers/auth.Routes.js");
const companyrouter = require("./routers/companies.Routes.js");
const memberrouter = require("./routers/members.Routes.js");
const passresetrouter = require("./routers/passreset.Routes.js");
const profile = require("./routers/profile.Routes.js");
const Userschema = require("./models/user.model.js");
const { sendEmail } = require("./utils/emailService.js");

// rest object
const app = express();
const allowedOrigins = [
  "https://pnycareer.com",
  "https://www.pnycareer.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        // Allow requests with matching origin or no origin (e.g., non-browser clients)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Frontend URL
//     credentials: true, // Allows cookies (including JWT) to be sent
//     methods: "GET,POST,PUT,DELETE", // Limit the allowed methods
//     allowedHeaders: "Content-Type,Authorization", // Specify the headers you allow
//   })
// );

dotenv.config();

// datbase conection
dbConnection();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("./uploads"));

app.get("/get", (req, res) => {
  return res.send("Hellow World");
});

cron.schedule("0 0 * * *", async () => {
  // Runs at midnight every day
  try {
    await Userschema.deleteMany({ isVerified: false });
    console.log("All unverified users have been cleaned up.");

    // Send notification email
    await sendEmail(
      "rahil.azhar10@gmail.com",
      "Daily Cleanup Report",
      "All unverified users have been successfully cleaned up"
    );
  } catch (error) {
    console.error("Error during cleanup or sending email:", error);
  }
});

app.use("/api/v1/jobs", jobsRouterCollection);
app.use("/api/v1/users", userrouter);
app.use("/api/v1/company", companyrouter);
app.use("/api/v1/members", memberrouter);
app.use("/api/v1/reset" , passresetrouter)
app.use("/api/v1/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.bgMagenta);
});
