import JobPost from '../models/jobPost.js';
import Job from '../models/jobApply.js';
import { getOrSetCache } from '../utils/cache.js';
import redis from '../utils/redis.js';
import { VALID_STATUS_TRANSITIONS } from '../constants/jobStatus.js';

export const createJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const {
            company,
            companyLogo,
            companyWebsite,
            title,
            description,
            location,
            salary,
            openings,
            employmentType,
            type,
            deadline,
            level,        
            department,   
            tags          
        } = req.body;


        if (!company || !title || !description || !type || !location || !salary || !employmentType) {
            return res.status(400).json({ message: "Missing required fields." });
        }      

        const jobPostData = {
            recruiter: recruiterId,
            company,
            companyLogo,
            companyWebsite,
            title,
            description,
            location,
            salary,
            openings,
            employmentType,
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
        console.error('Error in createJobPost:', error);
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

        const enrichedJobPosts = jobPosts.map(job => ({
            ...job,
            isOpen: job.isActive && job.deadline && new Date(job.deadline) > new Date()
        }));

        return res.status(200).json({ message: "Job posts found successfully", jobPosts: enrichedJobPosts });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const updateJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId } = req.params;

        const allowedUpdates = ['title', 'description', 'company', 'companyLogo', 'companyWebsite','location', 'type', 'deadline', 'tags', 'level', 'department', 'isActive'];
        const filteredData = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key)));

        const updatedJobPost = await JobPost.findOneAndUpdate({ _id: jobPostId, recruiter: recruiterId }, filteredData, { new: true });
        if(!updatedJobPost) {
            return res.status(404).json({ message: "Job post not found or unauthorized" });
        }

        await redis.del(`jobPost:${recruiterId}:${jobPostId}`);
        await redis.del(`jobPosts:${recruiterId}`);
        await redis.del(`applications:${jobPostId}`);

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
            return await Job.find({
                jobPostId,
                status: { $ne: null } 
            })
                .populate('userId', 'name email profilePic')
                .lean();
        }, 60);

        return res.status(200).json({  applications });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getJobPostsWithApplications = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { since } = req.query;
    
        const sinceDate = since ? new Date(since) : null;
        if (since && isNaN(sinceDate)) {
            return res.status(400).json({ message: "Invalid 'since' date format." });
        }

        const jobPosts = await JobPost.find({ recruiter: recruiterId })
            .select('_id title')
            .lean();
    
        if (!jobPosts.length) {
            return res.status(200).json({ jobPosts: [] });
        }
    
        const jobPostIds = jobPosts.map(j => j._id);
    
        const filter = {
            jobPostId: { $in: jobPostIds },
            status: { $nin: [null, 'Withdrawn'] },  
            };
        if (sinceDate) {
            filter.createdAt = { $gte: sinceDate };
        }
    
        const applications = await Job.find(filter)
            .select('createdAt status jobPostId dateApplied')
            .lean();
    
        const grouped = {};
        for (const app of applications) {
            const jobId = app.jobPostId.toString();
            if (!grouped[jobId]) grouped[jobId] = [];
            grouped[jobId].push(app);
        }
    
        const result = jobPosts.map(post => ({
            ...post,
            applications: grouped[post._id.toString()] || []
        }));
    
        return res.status(200).json({ jobPosts: result });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch job posts with applications",
            error: error.message,
        });
    }
};
  

export const getJobApplications = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { statusQuery, since, page = 1, limit = 20 } = req.query;
        const noPagination = req.query.noPagination === 'true';


        const jobPosts = await JobPost.find({ recruiter: recruiterId }).lean();
        if (jobPosts.length === 0) {
            return res.status(200).json({ applications: [] });
        }

        const jobPostIds = jobPosts.map(job => job._id);
        const filter = {
            jobPostId: { $in: jobPostIds }
        };

        if (statusQuery) {
            const normalizedStatuses = statusQuery.split(',').map(s =>
                s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
            );
            filter.status = { $in: normalizedStatuses };
        } else {
            filter.status = { $nin: [null, 'Withdrawn'] };
        }

        if (since) {
            const sinceDate = new Date(since);
            if (isNaN(sinceDate)) {
                return res.status(400).json({ message: "Invalid 'since' date format." });
            }
            filter.dateApplied = { $gte: sinceDate };
        }

        let query = Job.find(filter)
        .sort({ createdAt: -1 })
        .populate('userId', 'name email profilePic')
        .populate('jobPostId', 'title company');

        if (!noPagination) {
        const skipValue = (parseInt(page) - 1) * parseInt(limit);
        query = query.skip(skipValue).limit(parseInt(limit));
        }

        const applications = await query.lean();

        return res.status(200).json({
            applications,
            meta: {
                total: applications.length,
                page: parseInt(page),
                limit: parseInt(limit),
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retrieving job applications",
            error: error.message
        });
    }
};

export const getApplicationDetails = async(req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId, userId } = req.params;

        const jobPost = await JobPost.findOne({ _id: jobPostId, recruiter: recruiterId });
        if(!jobPost) {
            return res.status(403).json({ message: "Unauthorized or job post not found" });
        }

        const job = await Job.findOne({ jobPostId, userId })
        .populate('userId', 'name email profilePic')
        .populate('resume');

        if (!job) {
        return res.status(404).json({ message: "Application not found" });
        }

        const coverLetter = job.resume?.coverLetters?.find(
        cl => cl.versionNumber === job.coverLetterVersionNumber
        );

        return res.status(200).json({
        message: "Application fetched successfully",
        applicant: job.userId,
        currentStatus: job.status,
        interactionHistory: job.interactionHistory
            .filter(entry => entry.action !== 'saved' && entry.action !== 'unsaved')
            .sort((a, b) => new Date(b.timestamps) - new Date(a.timestamps)),
        appliedResume: job.resume
            ? {
                resumeId: job.resume._id,
                versionNumber: job.resumeVersionNumber
            }
            : null,
        appliedCoverLetter: coverLetter
            ? {
                resumeId: job.resume._id,
                versionNumber: coverLetter.versionNumber,
                content: coverLetter.content
            }
            : null
        });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const search = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const query = req.query.q?.trim();

        if(!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const cacheKey = `search:${recruiterId}:${query.toLowerCase()}`;

        const result = await getOrSetCache(cacheKey, async () => {
            const allJobPosts = await JobPost.find({ recruiter: recruiterId }).select('_id').lean();
            const allJobPostIds = allJobPosts.map((job) => job._id);

            const jobPosts = await JobPost.find({
                recruiter: recruiterId,
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { tags: { $in: [query.toLowerCase()] } },
                ]
            }).lean();

            let applicants = [];

            if (allJobPostIds.length > 0) {
                applicants = await Job.find({
                  jobPostId: { $in: allJobPostIds },
                  status: { $ne: null },
                }).populate({
                    path: 'userId',
                    match: { name: { $regex: query, $options: 'i' } },
                }).populate('jobPostId')
                  .limit(10)
                  .lean();

                applicants = applicants.filter(app => app.userId);
            }

            return { jobPosts, applicants };
        }, 30);

        return res.status(200).json({ message: "Search results found", result });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId, userId } = req.params;
        const { status: newStatus } = req.body;

        const job  = await Job.findOne({ jobPostId, userId}).populate('jobPostId', 'recruiter');

        if(!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if(String(job.jobPostId.recruiter) !== String(recruiterId)) {
            return res.status(403).json({ message: "You are not authorized to update this" });
        }

        const currentStatus = job.status || null;
        const validNextStatuses = VALID_STATUS_TRANSITIONS[currentStatus] || [];
        if(!validNextStatuses.includes(newStatus)) {
            return res.status(400).json({ message: `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed: [${validNextStatuses.join(', ')}]` })
        }

        job.status = newStatus;

        job.interactionHistory.push({
            action: newStatus.toLowerCase().replace(/ /g, '_'),
            fromStatus: currentStatus,
            toStatus: newStatus,
            timestamps: new Date()
        });

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
        await redis.del(`applications:${jobPostId}`);

        const keys = await redis.keys(`search:${recruiterId}:*`);
        if (keys.length) await redis.del(keys);

        return res.status(200).json({ message: "Job post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while deleting job post", error: error.message });
    }
}
