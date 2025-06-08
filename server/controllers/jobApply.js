import Job from '../models/jobApply.js';
import JobPost from '../models/jobPost.js';
import { getOrSetCache } from '../utils/cache.js';
import redis from '../utils/redis.js';

const normalizeToArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [val];
};  

const mergeQueryArrays = (...args) => {
    return args.flatMap(val => {
      if (!val) return [];
      if (typeof val === 'string') return val.trim() ? [val] : [];
      return Array.isArray(val) ? val : [val];
    });
};


export const getAvailableJobs = async (req, res) => {
    try {
        const { title, location, minSalary,  maxSalary, type, typeQuery, employmentType, level, levelQuery, department, search } = req.query;
        const userId = req.user._id;
        
        const stringify = (val) => Array.isArray(val) ? val.sort().join(',') : val || 'all';

        const cacheKey = `availableJobs:${stringify(title)}:${stringify(location)}:${stringify(type)}:${stringify(typeQuery)}:${stringify(employmentType)}:${stringify(level)}:${stringify(levelQuery)}:${stringify(department)}:${minSalary || 0}:${maxSalary || 'max'}:${search || 'none'}`;

        const jobs = await getOrSetCache(cacheKey, async () => {
            const filter = {
                isActive: true,
                deadline: { $gte: new Date() }
            };

            if (title) filter.title = new RegExp(title, 'i');
            if (location) filter.location = new RegExp(location, 'i');


            const addPartialMatchFilter = (fieldName, values = []) => {
                if (!values || values.length === 0) return;
                const orConditions = values.map(val => ({
                    [fieldName]: { $regex: val, $options: 'i' }
                }));
            
                filter.$and = filter.$and || [];
                filter.$and.push({ $or: orConditions });
            };
            
            


            addPartialMatchFilter('type', mergeQueryArrays(type, typeQuery));
            addPartialMatchFilter('employmentType', normalizeToArray(employmentType));
            addPartialMatchFilter('level', mergeQueryArrays(level, levelQuery));
            addPartialMatchFilter('department', normalizeToArray(department));



            if (search) {
                const regex = new RegExp(search, 'i');
                filter.$or = [
                    { title: regex },
                    { description: regex },
                    { company: regex }
                ];
            }

            if(minSalary || maxSalary) {
                filter.salary = {};
                if(minSalary) filter.salary.$gte = parseInt(minSalary);
                if(maxSalary) filter.salary.$lte = parseInt(maxSalary);
            }

            return await JobPost.find(filter).sort({ createdAt: -1 }).lean();
        }, 60);

        const jobPostIds = jobs.map(job => job._id);
        const userJobs = await Job.find({ userId, jobPostId: { $in: jobPostIds } }).lean();

        const userJobsMap = new Map(
            userJobs.map(job => [job.jobPostId.toString(), { isSaved: job.isSaved, status: job.status }])
        );

        const jobsWithUserData = jobs.map(job => {
            const userJob = userJobsMap.get(job._id.toString());
            return {
                ...job,
                isSaved: userJob?.isSaved || false,
                status: userJob?.status || null
            }
        });

        return res.status(200).json({ message: "Jobs fetched successfully", jobs: jobsWithUserData });
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
        .populate('jobPostId', 'recruiter title company companyLogo description location type employmentType level department tags deadline isActive applicationCount createdAt');

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
                .populate('jobPostId', 'recruiter title company companyLogo description location type employmentType level department tags deadline isActive applicationCount createdAt')
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

export const getSavedJobApplications = async (req, res) => {
    try {
        const userId = req.user._id;

        const savedJobs = await Job.find({ userId, isSaved: true})
        .sort({ createdAt: -1 })
        .populate('jobPostId', 'recruiter title company companyLogo description location type employmentType level department tags deadline isActive applicationCount createdAt')
        .lean();

        if(savedJobs.length === 0) {
            return res.status(404).json({ message: "No saved jobs found" });
        }

        const formattedJobs = savedJobs.map(job => ({
            ...job,
            ...job.jobPostId,
            createdAt: job.jobPostId.createdAt
        })
        )
        return res.status(200).json({ jobs: formattedJobs });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching saved jobs", error: error.message });
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

        return res.status(200).json({ message: isSaved ? 'Job saved' : 'Job unsaved' });
        
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