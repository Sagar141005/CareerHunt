import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { validationResult } from 'express-validator'

export const protectAndVerifyRole = (roles) => {
    return async (req, res, next) => {
        const token = req.cookies.token;
    
        if(!token) {
            return res.status(401).json({ message: "Authorization failed" });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
    
            if(!user) {
                return res.status(401).json({ message: "User not found" });
            }
            req.user = user;
    
            if(!roles.includes(user.role)) {
                return res.status(403).json({ message: "Access denied. You do not have the required role"});
            }
    
            next();
        } catch (error) {
            res.status(401).json({ message: `Authorization failed: ${error.message}` });
        }
    }
};

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}