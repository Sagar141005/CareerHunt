import express from "express";
import { protectAndVerifyRole, validateRequest } from "../middlewares/authMiddleware.js";
import { applyToJob, getAllJobApplications, getJobApplication, withdrawApplication } from "../controllers/jobApply.js";
import { applyToJobValidator, jobIdValidator } from "../validators/jobApply.js";

const router = express.Router();

router.post('/:jobPostId', applyToJobValidator , validateRequest, protectAndVerifyRole, applyToJob);

router.get('/all', protectAndVerifyRole, getAllJobApplications);

router.get('/:jobId', jobIdValidator, validateRequest, protectAndVerifyRole, getJobApplication);

router.patch('/withdraw/:jobId', jobIdValidator, validateRequest, protectAndVerifyRole, withdrawApplication);


export default router;