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
        type: String 
    },
    score: {
        type: Number
    },
    insights: {
        keywords: [String],
        matchedSkills: [String],
        suggestions: String
    },
    version: {
        type: Number,
        default: 1
    }
}, { timestamps: true });


export const Resume = mongoose.model('Resume', ResumeSchema);