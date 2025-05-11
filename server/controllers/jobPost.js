import JobPost from '../models/jobPost';
import Job from '../models/job';

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

        res.status(201).json({ message: "Job post created successfully", data: { jobPost } });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while creating job post", error: error.message});
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

        res.status(200).json({ message: "Job post found", data: { jobPost } });
        
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const getAllJobPosts = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const jobPosts = await JobPost.find({ recruiter: recruiterId }).sort({ createdAt: -1 });

        if(!jobPosts) {
            return res.status(404).json({ message: "No job posts found"});
        }

        res.status(200).json({ message: "Job posts found successfully", data: { jobPosts } });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
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

        res.status(200).json({ message: "Job post updated successfully", data: { updatedJobPost } });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
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
        res.status(200).json({ data: { applications } });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
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

        res.status(200).json({ message: "Job status updated successfully", data: { job } });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
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

        res.status(200).json({ message: "Job post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting job post", error: error.message });
    }
}
