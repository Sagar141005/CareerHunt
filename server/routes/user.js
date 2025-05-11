import express from "express";
import { loginUser, logoutUser, profile, signupUser } from '../controllers/user';
import { protectAndVerifyRole, validateRequest } from "../middlewares/authMiddleware";
import { loginValidator, signupValidator } from "../validators/user";

const router = express.Router();

router.post('/signup', signupValidator, validateRequest, signupUser);

router.post('/login', loginValidator, validateRequest, loginUser);

router.get('/profile', protectAndVerifyRole, profile);

router.post('/logout', logoutUser);

export default router;