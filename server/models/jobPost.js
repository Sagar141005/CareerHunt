import mongoose from "mongoose";

const JobPostSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    }, 
    companyLogo: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: [10, "Description should be atleast 10 characters long."],
    },
    location: {
        type: String
    },
    type: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        required: true
    }, 
    deadline: {
        type: Date,
        validate: {
          validator: function (value) {
            return value > Date.now();
          },
          message: 'Deadline must be in the future!'
        }
    }      
}, { timestamps: true });

const JobPost = mongoose.model('JobPost', JobPostSchema);

export default JobPost;