import express from "express";
import { protectAndVerifyRole } from "../middlewares/authMiddleware.js";
import {
  createResume,
  getResumeById,
  updateResume,
  getUserResumes,
  deleteResume,
  improveText,
  createCoverLetter,
} from "../controllers/resume.js";

const router = express.Router();

router.get("/all", protectAndVerifyRole(["jobseeker"]), getUserResumes);
router.post("/create", protectAndVerifyRole(["jobseeker"]), createResume);
router.get("/:id", protectAndVerifyRole(["jobseeker"]), getResumeById);
router.put("/:id", protectAndVerifyRole(["jobseeker"]), updateResume);
router.delete("/:id", protectAndVerifyRole(["jobseeker"]), deleteResume);

router.post("/ai/enhance", protectAndVerifyRole(["jobseeker"]), improveText);

router.post(
  "/ai/cover-letter",
  protectAndVerifyRole(["jobseeker"]),
  createCoverLetter
);

export default router;
