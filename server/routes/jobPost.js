import express from "express";
import { createJobPost, deleteJobPost, getAllJobPosts, getApplicationsForJobPost, getJobPostById, updateJobPost, updateStatus } from "../controllers/job";
import { protectAndVerifyRole, validateRequest } from "../middlewares/authMiddleware";
import { jobPostBodyValidator, jobPostIdValidator, updateJobPostValidator, updateStatusValidator } from "../validators/jobPost";


const router = express.Router();

router.post('/create', jobPostBodyValidator, validateRequest, protectAndVerifyRole, createJobPost);

router.get('/:jobPostId', jobPostIdValidator, validateRequest, protectAndVerifyRole, getJobPostById);

router.get('/all', protectAndVerifyRole, getAllJobPosts);

router.put('/:jobPostId', updateJobPostValidator, validateRequest, protectAndVerifyRole, updateJobPost);

router.get('/applications/:jobPostId', jobPostIdValidator, validateRequest, protectAndVerifyRole, getApplicationsForJobPost);

router.put('/:jobPostId/:userId', updateStatusValidator, validateRequest, protectAndVerifyRole, updateStatus);

router.delete('/:jobPostId', jobPostIdValidator, validateRequest, protectAndVerifyRole, deleteJobPost);


export default router;