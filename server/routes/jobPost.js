import express from "express";
import { createJobPost, deleteJobPost, getAllJobPosts, getApplicationsForJobPost, getJobPostById, search, updateJobPost, updateStatus } from "../controllers/jobPost.js";
import { protectAndVerifyRole, validateRequest } from "../middlewares/authMiddleware.js";
import { jobPostBodyValidator, jobPostIdValidator, updateJobPostValidator, updateStatusValidator } from "../validators/jobPost.js";


const router = express.Router();

router.post('/create', jobPostBodyValidator, validateRequest, protectAndVerifyRole(['recruiter']), createJobPost);

router.get('/all', protectAndVerifyRole(['recruiter']), getAllJobPosts);

router.get('/search', protectAndVerifyRole(['recruiter']), search);

router.get('/:jobPostId', jobPostIdValidator, validateRequest, protectAndVerifyRole(['recruiter']), getJobPostById);

router.put('/:jobPostId', updateJobPostValidator, validateRequest, protectAndVerifyRole(['recruiter']), updateJobPost);

router.get('/applications/:jobPostId', jobPostIdValidator, validateRequest, protectAndVerifyRole(['recruiter']), getApplicationsForJobPost);

router.put('/:jobPostId/:userId', updateStatusValidator, validateRequest, protectAndVerifyRole(['recruiter']), updateStatus);

router.delete('/:jobPostId', jobPostIdValidator, validateRequest, protectAndVerifyRole(['recruiter']), deleteJobPost);


export default router;