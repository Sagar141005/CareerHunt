import { body, param } from 'express-validator'

export const applyToJobValidator = [
        param('jobPostId')
                .isMongoId().withMessage("Invalid job post ID format"),
        body('notes')
                .isString()
]

export const jobIdValidator = [
        param('jobId')
                .isMongoId().withMessage("Invalid job ID format"),
] 