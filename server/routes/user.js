import express from "express";
import {
  changePassword,
  deleteUser,
  loginUser,
  logoutUser,
  profile,
  signupUser,
  socialLogin,
  storeRoleInSession,
  updateProfile,
} from "../controllers/user.js";
import {
  protectAndVerifyRole,
  validateRequest,
} from "../middlewares/authMiddleware.js";
import { loginValidator, signupValidator } from "../validators/user.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signupUser);

router.post("/login", loginValidator, validateRequest, loginUser);

router.post("/social/preference", storeRoleInSession);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/linkedin",
  passport.authenticate("linkedin", { scope: ["openid", "profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  socialLogin
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  socialLogin
);
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { session: false }),
  socialLogin
);

router.get(
  "/profile",
  protectAndVerifyRole(["jobseeker", "recruiter"]),
  profile
);

router.put(
  "/profile",
  protectAndVerifyRole(["jobseeker", "recruiter"]),
  updateProfile
);

router.post("/logout", logoutUser);

router.patch(
  "/change-password",
  protectAndVerifyRole(["jobseeker", "recruiter"]),
  changePassword
);

router.delete(
  "/delete",
  protectAndVerifyRole(["jobseeker", "recruiter"]),
  deleteUser
);

export default router;
