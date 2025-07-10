import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { validationResult } from 'express-validator'

export const protectAndVerifyRole = (roles) => {
    return async (req, res, next) => {
      console.log("Cookies received:", req.cookies);  // ADD THIS
      let token = req.cookies.token;
  
      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "Authorization failed" });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }
  
        if (!roles.includes(user.role)) {
          return res.status(403).json({ message: "Access denied" });
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