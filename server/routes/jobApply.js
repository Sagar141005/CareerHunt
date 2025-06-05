import express from "express";
import { protectAndVerifyRole, validateRequest } from "../middlewares/authMiddleware.js";
import { applyToJob, getAllJobApplications, getAvailableJobs, getJobApplication, withdrawApplication } from "../controllers/jobApply.js";
import { applyToJobValidator, jobIdValidator } from "../validators/jobApply.js";

const router = express.Router();

router.get('/all', protectAndVerifyRole(['jobseeker']), getAvailableJobs);

router.post('/:jobPostId', applyToJobValidator , validateRequest, protectAndVerifyRole(['jobseeker']), applyToJob);

router.get('/applied/all', protectAndVerifyRole(['jobseeker']), getAllJobApplications);

router.get('/:jobId', jobIdValidator, validateRequest, protectAndVerifyRole(['jobseeker']), getJobApplication);

router.patch('/withdraw/:jobId', jobIdValidator, validateRequest, protectAndVerifyRole(['jobseeker']), withdrawApplication);


export default router;