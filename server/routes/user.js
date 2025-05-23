import express from "express";
import { loginUser, logoutUser, profile, signupUser } from '../controllers/user.js';
import { protectAndVerifyRole, validateRequest } from "../middlewares/authMiddleware.js";
import { loginValidator, signupValidator } from "../validators/user.js";

const router = express.Router();

router.post('/signup', signupValidator, validateRequest, signupUser);

router.post('/login', loginValidator, validateRequest, loginUser);

router.get('/profile', protectAndVerifyRole(['jobseeker', 'recruiter']), profile);

router.post('/logout', logoutUser);

export default router;