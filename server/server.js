import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import jobApplyRoutes from "./routes/jobApply.js";
import jobPostRoutes from "./routes/jobPost.js";
import resumeRoutes from "./routes/resume.js";
import morgan from "morgan";
import helmet from "helmet";
import "./config/passport.js";
import passport from "passport";
import session from "express-session";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173", // for local dev
  "https://career-hunt.xyz", // for Vercel frontend
  "https://www.career-hunt.xyz", // for Vercel frontend
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Required for Vercel + Render
      sameSite: "None",
      httpOnly: true,
    },
  })
);
app.use(passport.session());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth", userRoutes);
app.use("/api/applications", jobApplyRoutes);
app.use("/api/job-posts", jobPostRoutes);
app.use("/api/ai", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
