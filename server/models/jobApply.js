import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost',
        required: true
    },
    status: {
        type: String,
        enum: ['Saved', 'Applied', 'Interview', 'Withdrawn' , 'Offer', 'Rejected'],
        default: 'Saved',
        required: true
    },
    notes: {
        type: String,
        maxlength: 500
    },
    dateApplied: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

export default Job;