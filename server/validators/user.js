import { body } from 'express-validator';

export const signupValidator = [
    body('name')
        .notEmpty().withMessage("Name is required")
        .trim(),
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email")
        .isLength({ min: 11 }).withMessage("Email must be at least 11 characters")
        .trim(),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/\d/).withMessage("Password must contain at least one number")

]

export const loginValidator = [
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email")
        .isLength({ min: 11 }).withMessage("Email must be at least 11 characters")
        .trim(),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/\d/).withMessage("Password must contain at least one number")

]