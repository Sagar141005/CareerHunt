import { body, param } from 'express-validator'

export const jobPostIdValidator = [
    param('jobPostId').isMongoId().withMessage("Invalid job post id format")
]

export const jobPostBodyValidator = [
    body('company')
      .isString().withMessage("Company must be a string")
      .notEmpty().withMessage("Company name is required"),
    body('companyLogo')
      .optional().isString().withMessage("Company logo must be a string"),
    body('title')
      .isString().withMessage("Title must be a string")
      .notEmpty().withMessage("Job title is required"),
    body('description')
      .isString().withMessage("Description must be a string")
      .notEmpty().withMessage("Job description is required")
      .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),
    body('location')
      .notEmpty().withMessage("Location is required")
      .isString().withMessage("Location must be a string"),
    body('type')
      .notEmpty().withMessage("Type is required")
      .isIn(['On-site', 'Remote', 'Hybrid']).withMessage("Enter a valid job type"),
    body('level')
      .notEmpty().withMessage("Level is required")
      .isIn(['Intern', 'Junior', 'Mid', 'Senior', 'Lead']).withMessage("Enter a valid job level"),
    body('department')
      .notEmpty().withMessage("Department is required")
      .isIn(['IT', 'Design', 'Hospitality', 'Marketing', 'Sales', 'Finance', 'Other']).withMessage("Enter a valid department"),
    body('deadline')
      .notEmpty().withMessage("Deadline is required")
      .isISO8601().withMessage("Deadline must be a valid date"),
    body('tags')
      .optional().isArray().withMessage("Tags must be an array of strings")
]


export const updateJobPostValidator = [
    param('jobPostId')
      .isMongoId().withMessage("Invalid job post ID format"),

    body('title')
      .optional().isString().withMessage("Title must be a string"),

    body('description')
      .optional().isString().isLength({ min: 10, max: 500 })
      .withMessage("Description must be between 10 and 500 characters"),

    body('location')
      .optional().isString().withMessage("Location must be a string"),

    body('type')
      .optional().isIn(['On-site', 'Remote', 'Hybrid'])
      .withMessage("Invalid type"),

    body('level')
      .optional().isIn(['Intern', 'Junior', 'Mid', 'Senior', 'Lead'])
      .withMessage("Invalid level"),

    body('department')
      .optional().isIn(['IT', 'Design', 'Hospitality', 'Marketing', 'Sales', 'Finance', 'Other'])
      .withMessage("Invalid department"),

    body('tags')
      .optional().isArray().withMessage("Tags must be an array of strings"),
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
      .isIn(['Interview', 'Offer', 'Shortlist', 'On-hold', 'Rejected', 'Withdrawn', 'Hired'])
      .withMessage("Enter a valid status")
]