import { body, param } from "express-validator";

export const applyToJobValidator = [
  param("jobPostId").isMongoId().withMessage("Invalid job post ID format"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .isLength({ max: 500 })
    .withMessage("Notes must be 500 characters or fewer"),
];

export const jobIdValidator = [
  param("jobId").isMongoId().withMessage("Invalid job ID format"),
];
