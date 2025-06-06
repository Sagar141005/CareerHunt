import JobPost from '../models/jobPost.js';
import Job from '../models/jobApply.js';
import { getOrSetCache } from '../utils/cache.js';
import redis from '../utils/redis.js';

const VALID_STATUSES = ['Interview', 'Shortlist', 'On-hold', 'Rejected'];

export const createJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const {
            company,
            companyLogo,
            title,
            description,
            location,
            type,
            deadline,
            level,        
            department,   
            tags          
        } = req.body;


        if (!company || !title || !description || !type || !location) {
            return res.status(400).json({ message: "Missing required fields." });
        }      

        const jobPostData = {
            recruiter: recruiterId,
            company,
            companyLogo,
            title,
            description,
            location,
            type,
            deadline,
            level,
            department,
            tags
          };
          const jobPost = new JobPost(jobPostData);
          await jobPost.save();

          await redis.del(`jobPosts:${recruiterId}`);

        return res.status(201).json({ message: "Job post created successfully", data: { jobPost } });
    } catch (error) {
        return res.status(500).json({ message: "Error occurred while creating job post", error: error.message});
    }
}

export const getJobPostById = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId } = req.params;
        const cacheKey = `jobPost:${recruiterId}:${jobPostId}`;

        const jobPost = await getOrSetCache(cacheKey, async () => {
            return await JobPost.findOne({ _id: jobPostId, recruiter: recruiterId }).lean();
        }, 120);

        if(!jobPost) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.status(200).json({ message: "Job post found", jobPost });
        
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getAllJobPosts = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const key = `jobPosts:${recruiterId}`;

        const jobPosts = await getOrSetCache(key, async () => {
            return await JobPost.find({ recruiter: recruiterId }).sort({ createdAt: -1 }).lean();
        }, 60);

        if(jobPosts.length === 0) {
            return res.status(404).json({ message: "No job posts found"});
        }

        return res.status(200).json({ message: "Job posts found successfully", jobPosts });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const updateJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId } = req.params;

        const allowedUpdates = ['title', 'description', 'company', 'companyLogo', 'location', 'type', 'deadline', 'tags', 'level', 'department', 'isActive'];
        const filteredData = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key)));

        const updatedJobPost = await JobPost.findOneAndUpdate({ _id: jobPostId, recruiter: recruiterId }, filteredData, { new: true });
        if(!updatedJobPost) {
            return res.status(404).json({ message: "Job post not found or unauthorized" });
        }

        await redis.del(`jobPost:${recruiterId}:${jobPostId}`);
        await redis.del(`jobPosts:${recruiterId}`);
        await redis.del(`applications:${jobPostId._id}`);

        const keys = await redis.keys(`search:${recruiterId}:*`);
        if (keys.length) await redis.del(keys);

        return res.status(200).json({ message: "Job post updated successfully", updatedJobPost });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getApplicationsForJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId } = req.params;
        const cacheKey = `applications:${jobPostId}`

        const jobPost = await JobPost.findOne({ _id: jobPostId, recruiter: recruiterId }).lean();
        if(!jobPost) {
            return res.status(404).json({ message: "Job post not found or unauthorized" });
        }

        const applications = await getOrSetCache(cacheKey, async () => {
            return await Job.find({ jobPostId }).populate('userId', 'name email').lean();
        }, 60);

        return res.status(200).json({  applications });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getJobApplications = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { statusQuery, since } = req.query;
        const statusArray = statusQuery ? statusQuery.split(',') : [];
        
        const jobPosts = await JobPost.find({ recruiter: recruiterId }).lean();
        if(jobPosts.length === 0) {
            return res.status(404).json({ message: "No job posts found for this recruiter." });
        }
        const jobPostIds = jobPosts.map(job => job._id);

        const filter = {
            jobPostId: { $in: jobPostIds }
        };

        if(statusArray.length) {
            filter.status = { $in: statusArray}
        };
        if(since) {
            const sinceDate = new Date(since);
            if(isNaN(sinceDate)) {
                return res.status(400).json({ message: "Invalid 'since' date format." });
            }
            filter.createdAt = { $gte: sinceDate }
        };

        const applications = await Job.find(filter)
        .populate('userId', 'name email')
        .populate('jobPostId', 'title company');

        return res.status(200).json({ applications });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while retrieving job applications", error: error.message });
    }
}

export const search = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const query = req.query.q?.trim();

        if(!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const result = await getOrSetCache(cacheKey, async () => {
            const jobPosts = await JobPost.find({
                recruiter: recruiterId,
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { tags: { $in: [query.toLowerCase()] } },
                ]
            }).lean();

            const jobIds = jobPosts.map(job => job._id);

            const applicants = await Job.find({
                jobPostId: { $in: jobIds }
            }).populate('userId').populate('jobPostId').limit(10).lean();

            const filteredApplicants = applicants.filter(app =>
                app.userId?.name?.toLowerCase().includes(query.toLowerCase())
            );

            return { jobPosts, applicants: filteredApplicants };
        }, 30);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId, userId } = req.params;
        const { status } = req.body;

        if(!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const job  = await Job.findOne({ jobPostId, userId}).populate('jobPostId', 'recruiter');

        if(!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if(String(job.jobPostId.recruiter) !== String(recruiterId)) {
            return res.status(403).json({ message: "You are not authorized to update this" });
        }

        job.status = status;
        await job.save();

        return res.status(200).json({ message: "Job status updated successfully", job });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const deleteJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId } = req.params;

        const jobPost = await JobPost.findOne({ _id: jobPostId, recruiter: recruiterId });
        if(!jobPost) {
            return res.status(404).json("Job post not found or you do not have the authorization");
        }

        await JobPost.deleteOne({ _id: jobPostId });

        await redis.del(`jobPost:${recruiterId}:${jobPostId}`);
        await redis.del(`jobPosts:${recruiterId}`);
        await redis.del(`applications:${jobPostId._id}`);

        const keys = await redis.keys(`search:${recruiterId}:*`);
        if (keys.length) await redis.del(keys);

        return res.status(200).json({ message: "Job post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while deleting job post", error: error.message });
    }
}
