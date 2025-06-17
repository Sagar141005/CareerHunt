import mongoose from "mongoose";

const JobPostSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: { 
        type: String, 
        required: true 
    },
    companyLogo: { 
        type: String 
    },
    companyWebsite: { 
        type: String 
    },
    description: {
        type: String,
        required: true,
        minlength: [10, "Description should be at least 10 characters long."]
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    openings: {
        type: Number,
        default: 1,
        min: [1, 'At least one opening is required.']
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Freelance', 'Internship'],
        required: true
    },
    level: {
        type: String,
        enum: ['Intern', 'Junior', 'Mid', 'Senior', 'Lead'],
        default: 'Mid'
    },
    department: {
        type: String,
        enum: ['IT', 'Design', 'Hospitality', 'Marketing', 'Sales', 'Finance', 'Other'],
        default: 'Other',
    },
    tags: {
        type: [String], 
        default: []
    },
    deadline: {
        type: Date,
        validate: {
            validator: function(value) {
            return value > Date.now();
            },
        message: 'Deadline must be in the future!'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicationCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

JobPostSchema.index({ title: 'text', description: 'text' });
JobPostSchema.index({ type: 1 });
JobPostSchema.index({ location: 1 });
JobPostSchema.index({ department: 1 });
JobPostSchema.index({ deadline: 1 });
JobPostSchema.index({ tags: 1 });


JobPostSchema.methods.isCurrentlyOpen = function () {
  return this.isActive && this.deadline && this.deadline > new Date();
};

const JobPost = mongoose.model('JobPost', JobPostSchema);
export default JobPost;
