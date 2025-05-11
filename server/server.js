import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import userRoutes from './routes/user'
import jobApplyRoutes from './routes/jobApply'
import jobPostRoutes from './routes/jobPost'
import morgan from 'morgan';
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/auth', userRoutes);
app.use('/applications', jobApplyRoutes);
app.use('/job-posts', jobPostRoutes);

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use((err, req, res, nect) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});