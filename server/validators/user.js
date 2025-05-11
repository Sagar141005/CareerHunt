import { body, param } from 'express-validator';

export const signupValidator = [
    body('name')
        .notEmpty().withMessage("Name is required"),
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email"),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/\d/).withMessage("Password must contain at least one number")

]

export const loginValidator = [
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email"),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/\d/).withMessage("Password must contain at least one number")

]