import express from "express";
import { protectAndVerifyRole } from "../middlewares/authMiddleware.js";
import { improveResume, improveResumeForJob, uploadResume, getUserResumes, downloadResumeVersion, downloadCoverLetter, generateCoverLetterForJob } from "../controllers/resume.js";


const router = express.Router();

router.post('/resume/upload', protectAndVerifyRole(['jobseeker']) , uploadResume);

router.post('/resume/improve/:resumeId', protectAndVerifyRole(['jobseeker']), improveResume);

router.post('/resume/improve/:resumeId/:jobId', protectAndVerifyRole(['jobseeker']), improveResumeForJob);

router.get('/resume/all', protectAndVerifyRole(['jobseeker']), getUserResumes);

router.post('/cover-letter/:resumeId/:jobId', protectAndVerifyRole(['jobseeker']), generateCoverLetterForJob);

router.get('/resume/download', protectAndVerifyRole(['jobseeker', 'recruiter']), downloadResumeVersion);

router.get('/cover-letter/download', protectAndVerifyRole(['jobseeker', 'recruiter']), downloadCoverLetter);

export default router;