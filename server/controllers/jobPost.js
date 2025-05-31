import JobPost from '../models/jobPost.js';
import Job from '../models/jobPost.js';

export const createJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { company, companyLogo, title, description, location, type, deadline} = req.body;

        const jobPostData = {
            recruiter: recruiterId,
            company,
            companyLogo,
            title,
            description,
            type,
            deadline
        }
        if(location) {
            jobPostData.location = location;
        }

        const jobPost = new JobPost(jobPostData);
        await jobPost.save();

        return res.status(201).json({ message: "Job post created successfully", data: { jobPost } });
    } catch (error) {
        return res.status(500).json({ message: "Error occurred while creating job post", error: error.message});
    }
}

export const getJobPostById = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId } = req.params;
        const jobPost = await JobPost.findOne({ _id: jobPostId, recruiter: recruiterId });

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
        const jobPosts = await JobPost.find({ recruiter: recruiterId }).sort({ createdAt: -1 });

        if(!jobPosts) {
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
        const updateData = req.body;

        const updatedJobPost = await JobPost.findOneAndUpdate({ _id: jobPostId, recruiter: recruiterId}, updateData, { new: true });
        if(!updatedJobPost) {
            return res.status(404).json({ message: "Job post not found or unauthorized" });
        }

        return res.status(200).json({ message: "Job post updated successfully", data: { updatedJobPost } });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getApplicationsForJobPost = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId } = req.params;

        const jobPost = await JobPost.findOne({ _id: jobPostId, recruiter: recruiterId });
        if(!jobPost) {
            return res.status(404).json({ message: "Job post not found or unauthorized" });
        }

        const applications = await Job.find({ jobPostId }).populate('userId', 'name email');
        return res.status(200).json({  applications });
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

        const allJobPosts = await JobPost.find({ recruiter: recruiterId });

        const jobPosts = allJobPosts.filter(job =>
            job.title.toLowerCase().includes(query.toLowerCase())
        );

        const jobIds = allJobPosts.map(job => job._id);

        const applicants = await Job.find({
            jobPostId: { $in: jobIds }
        }).populate('userId').populate('jobPostId').limit(10);

        const filteredApplicants = applicants.filter(app =>
            app.userId?.name?.toLowerCase().includes(query.toLowerCase())
        );

        return res.status(200).json({
            jobPosts,
            applicants: filteredApplicants,
        });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { jobPostId, userId } = req.params;
        const { status } = req.body;

        const validStatus = ['Interview', 'Offer', 'Rejected'];
        if(!validStatus.includes(status)) {
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

        return res.status(200).json({ message: "Job status updated successfully", data: { job } });
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

        return res.status(200).json({ message: "Job post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while deleting job post", error: error.message });
    }
}
