import { body, param } from 'express-validator'

export const jobPostIdValidator = [
    param('jobPostId').isMongoId().withMessage("Invalid user id format")
]

export const jobPostBodyValidator = [
    body('company')
      .isString().withMessage("Company must be a string")
      .notEmpty().withMessage("Company name is required"),
    body('companyLogo')
      .notEmpty().withMessage("Company Logo is required"),
    body('title')
      .isString().withMessage("Title must be a string")
      .notEmpty().withMessage("Company title is required"),
    body('description')
      .isString().withMessage("Description must be a string")
      .notEmpty().withMessage("Company description is required")
      .isLength({ min: 10, max: 500 }).withMessage("Description length must be between 10 to 500 characters"),
    body('location')
      .optional().isString().withMessage("Location must be a string"),
    body('type')
      .notEmpty().withMessage("Type is required")
      .isIn(['On-site', 'Remote', 'Hybrid']).withMessage("Enter a valid type"),
    body('deadline')
      .notEmpty().withMessage("Deadline is required")
      .isISO8601().withMessage("Deadline must be a valid date")
]


export const updateJobPostValidator = [
    param('jobPostId')
      .isMongoId().withMessage("Invalid job post ID format"),
    body('title')
      .optional().isString().withMessage("Title must be a string"),
    body('description')
      .optional().isString()
      .isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 500 characters"),
    body('location')
    .optional().isString().withMessage("Location must be a string"),
    body('type')
    .optional().isIn(['On-site', 'Remote', 'Hybrid']).withMessage("Invalid type"),
    body('deadline')
    .optional()
    .isISO8601().withMessage("Deadline must be a valid date")
]

export const updateStatusValidator = [
    param('jobPostId')
    .isMongoId().withMessage("Invalid job post ID format"),
    param('userId')
    .isMongoId().withMessage("Invalid user ID format"),
    body('status')
      .notEmpty().withMessage("Status is required")
      .isIn(['Interview', 'Offer', 'Rejected']).withMessage("Enter a valid status")
]