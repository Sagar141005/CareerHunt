import Job from '../models/jobApply.js';
import JobPost from '../models/jobPost.js';
import { getOrSetCache } from '../utils/cache.js';
import redis from '../utils/redis.js';

export const getAvailableJobs = async (req, res) => {
    try {
        const { type, level, department, search } = req.query;
        
        const cacheKey = `availableJobs:${type || 'all'}:${level || 'all'}:${department || 'all'}:${search || 'none'}`;

        const jobs = await getOrSetCache(cacheKey, async () => {
            const filter = {
                isActive: true,
                deadline: { $gte: new Date() }
            };

            if (type) filter.type = type;
            if (level) filter.level = level;
            if (department) filter.department = department;
            if (search) filter.$text = { $search: search };

            return await JobPost.find(filter).sort({ createdAt: -1 }).lean();
        }, 60);

        return res.status(200).json({ message: "Jobs fetched successfully", jobs });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
}

export const applyToJob = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobPostId } = req.params;
        const { notes } = req.body;

        const job = await Job.findOne({ userId, jobPostId });
        if(job) {
            const currentStatus = job.status;

            const disallowedStatuses = ['Applied', 'Shortlisted', 'On-hold', 'Interview', 'Rejected', 'Hired'];

            if(disallowedStatuses.includes(currentStatus)) {
                return res.status(400).json({ message: `Cannot apply — already in status: "${currentStatus}"`});
            }

            if(currentStatus === 'Withdrawn' || currentStatus === null) {
                job.status = 'Applied';
                if(notes) job.notes = notes;
            }
        } else {
            job = new({
                userId,
                jobPostId,
                status: 'Applied',
                notes
            });
        }

        await job.save();

        await redis.del(`userApplications:${userId}`);

        return res.status(201).json({ message: "Successfully applied to job",  job });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getJobApplication = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobId } = req.params;

        const job = await Job.findOne({ _id: jobId, userId })
        .populate('jobPostId', 'recruiter company companyLogo title description location type');

        if(!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.status(200).json({ job });
        
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getAllJobApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        const cacheKey = `userApplications:${userId}`;

        const jobs = await getOrSetCache(cacheKey, async () => {
            const result = await Job.find({ userId })
                .sort({ createdAt: -1 })
                .populate('jobPostId', 'recruiter company companyLogo title description location type')
                .lean();

            return result;
        }, 60); 

        if(jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found" });
        }

        return res.status(200).json({ jobs });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const toggleSaveJob = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobPostId } = req.params;
        const { isSaved } = req.body;

        if(typeof isSaved !== 'boolean') {
            return res.status(400).json({ message: "`isSaved` must be true or false" });
        }

        let job = await Job.findOne({ userId, jobPostId });

        if(!job) {
            job = new Job({ userId, jobPostId, isSaved });
        } else {
            if(job.isSaved === isSaved) {
                return res.status(200).json({  message: `Job already ${isSaved ? 'saved' : 'unsaved'}` });
            }

            job.isSaved = isSaved;
        }

        await job.save()

        await redis.del(`userApplications:${userId}`);

        return res.status(200).json({ message: isSaved ? 'Job saved' : 'Job unsaved', job });
        
    } catch (error) {
        return res.status(500).json({ message: "Error saving/unsaving job", error: error.message });
    }
}

export const getInteractionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobId } = req.params;

        const job = await Job.findOne({ _id: jobId, userId }, 'interactionHistory');

        if(!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        return res.status(200).json({ data: job.interactionHistory });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching history', error: error.message });
    }
}

export const withdrawApplication = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobId } = req.params;

        const job = await Job.findOne({ _id: jobId, userId });

        if(!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }

        const disallowedStatuses = ['Withdrawn', 'Rejected', 'Hired'];
        if(disallowedStatuses.includes(job.status)) {
            return res.status(400).json({ message: `Cannot withdraw from job in status "${job.status}"` })
        }

        job.status = 'Withdrawn';

        await job.save();

        await redis.del(`userApplications:${userId}`);
        await redis.del(`jobApplication:${userId}:${jobId}`);

        return res.status(200).json({ message: "Application withdrawn successfully", job });
    } catch (error) {
        return res.status(500).json({ message: "Error while withdrawing from job", error: error.message });
    }
}