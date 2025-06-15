import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.js'
import jobApplyRoutes from './routes/jobApply.js'
import jobPostRoutes from './routes/jobPost.js'
import morgan from 'morgan';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from 'express-session';
import './config/passport.js';
import passport from "passport";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.VITE_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      httpOnly: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/auth', userRoutes);
app.use('/applications', jobApplyRoutes);
app.use('/job-posts', jobPostRoutes);

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});