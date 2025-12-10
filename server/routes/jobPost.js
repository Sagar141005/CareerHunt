import express from "express";
import {
  createJobPost,
  deleteJobPost,
  getJobApplications,
  getApplicationsForJobPost,
  getJobPostById,
  search,
  updateJobPost,
  updateStatus,
  getAllJobPosts,
  getApplicationDetails,
  getJobPostsWithApplications,
} from "../controllers/jobPost.js";
import {
  protectAndVerifyRole,
  validateRequest,
} from "../middlewares/authMiddleware.js";
import {
  jobPostBodyValidator,
  jobPostIdValidator,
  updateJobPostValidator,
  updateStatusValidator,
} from "../validators/jobPost.js";
import rateLimiterMiddleware from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/create",
  jobPostBodyValidator,
  validateRequest,
  protectAndVerifyRole(["recruiter"]),
  createJobPost
);

router.get(
  "/applicant/:jobPostId/:userId",
  protectAndVerifyRole(["recruiter"]),
  getApplicationDetails
);

router.get(
  "/applications/chart",
  protectAndVerifyRole(["recruiter"]),
  getJobPostsWithApplications
);

router.get(
  "/applications/all",
  protectAndVerifyRole(["recruiter"]),
  rateLimiterMiddleware,
  getJobApplications
);

router.get(
  "/all",
  protectAndVerifyRole(["recruiter"]),
  rateLimiterMiddleware,
  getAllJobPosts
);

router.get(
  "/search",
  protectAndVerifyRole(["recruiter"]),
  rateLimiterMiddleware,
  search
);

router.get(
  "/:jobPostId",
  jobPostIdValidator,
  validateRequest,
  protectAndVerifyRole(["recruiter"]),
  rateLimiterMiddleware,
  getJobPostById
);

router.put(
  "/:jobPostId",
  updateJobPostValidator,
  validateRequest,
  protectAndVerifyRole(["recruiter"]),
  updateJobPost
);

router.get(
  "/applications/:jobPostId",
  jobPostIdValidator,
  validateRequest,
  protectAndVerifyRole(["recruiter"]),
  rateLimiterMiddleware,
  getApplicationsForJobPost
);

router.put(
  "/update-status/:jobPostId/:userId",
  updateStatusValidator,
  validateRequest,
  protectAndVerifyRole(["recruiter"]),
  updateStatus
);

router.delete(
  "/:jobPostId",
  jobPostIdValidator,
  validateRequest,
  protectAndVerifyRole(["recruiter"]),
  deleteJobPost
);

export default router;
