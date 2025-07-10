import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { validationResult } from 'express-validator'
import redis from '../utils/redis.js';

export const protectAndVerifyRole = (roles) => {
    return async (req, res, next) => {
      let token;
  
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
  
      if (!token) {
        return res.status(401).json({ message: "Authorization failed: No token" });
      }

      const isBlacklisted = await redis.get(`bl_${token}`);
      if (isBlacklisted) {
        return res.status(401).json({ message: "Token has been blacklisted" });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }
  
        if (!roles.includes(user.role)) {
          return res.status(403).json({ message: "Access denied. Invalid role" });
        }
  
        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ message: `Authorization failed: ${error.message}` });
      }
    };
};
  

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}