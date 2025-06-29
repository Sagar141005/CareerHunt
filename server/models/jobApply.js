import mongoose from 'mongoose';
import { VALID_STATUS_TRANSITIONS } from '../constants/jobStatus.js';

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
    isSaved:  {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Applied', 'Withdrawn' , 'Shortlisted', 'On-hold', 'Interview', 'Rejected', 'Hired'],
        default: null,
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },
    resumeVersionNumber: {
        type: Number,
    },
    coverLetterVersionNumber: {
        type: Number,
    },
    interactionHistory: [{
        action: {
            type: String,
            enum: [
                'saved',
                'unsaved',
                'applied',
                'withdrawn',
                'shortlisted',
                'on_hold',
                'interview',
                'rejected',
                'hired'
            ],
            required: true
        },
        fromStatus: {
            type: String,
            enum: ['Applied', 'Withdrawn', 'Shortlisted', 'On-hold', 'Interview', 'Rejected', 'Hired', null]
        },
        toStatus: {
            type: String,
            enum: ['Applied', 'Withdrawn', 'Shortlisted', 'On-hold', 'Interview', 'Rejected', 'Hired']
        },
        timestamps: {
            type: Date,
            default: Date.now
        }
    }],
    dateApplied: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


JobSchema.pre('save', function(next) {
    const job = this;

    if(job.isModified('isSaved')) {
        job.interactionHistory.push({
            action: job.isSaved ? 'saved' : 'unsaved',
            timestamps: new Date()
        })
    }

    if(job.isModified('status')) {
        const oldStatus = job.get('status', null, { getters: false, virtuals: false, defaults: false });
        const newStatus = job.status;

        if(newStatus && newStatus !== oldStatus) {
            const validNextStatuses = VALID_STATUS_TRANSITIONS[oldStatus] || [];

            if(!validNextStatuses.includes(newStatus)) {
                return next(
                    new Error(`Invalid status transition from "${oldStatus}" to "${newStatus}".`)
                )
            }

            const action = newStatus.toLowerCase().replace('-', '_');
            
            job.interactionHistory.push({
                action,
                fromStatus: oldStatus || null,
                toStatus: newStatus,
                timestamps: new Date()
            })
        }
    }

    next();
})

JobSchema.index({ userId: 1, jobPostId: 1 }, { unique: true });

const Job = mongoose.model('Job', JobSchema);

export default Job;