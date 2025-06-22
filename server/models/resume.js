import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    versions: [
        {
            versionNumber: {
                type: Number,
                required: true,
            },
            content: {
                type: String,
                required: true
            },
            type: {
                type: String,
                enum: ['generalImproved', 'jobSpecific'],
                required: true
            },
            job: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'JobPost',
                required: false
            }, 
            createdAt : {
                type: Date,
                default: Date.now
            }
        }
    ],
    coverLetters: [
        {
            versionNumber: {
                type: Number,
                required: true
            }, 
            content: {
                type: String, 
                required: true
            },
            job: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'JobPost',
                required: false
            }, 
            createdAt : {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });


const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;
