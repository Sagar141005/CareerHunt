import User from "../models/user.js";
import jwt from 'jsonwebtoken';

export const signupUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role || 'jobseeker'
        });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", data: { newUser } });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Request Body from login:", req.body)
    try {
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(400).json({ message: "Email or password is incorrect"});
        }
        console.log("Comparing password:", password, user.password);
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({ message: "Email or password is incorrect"});
        }
        console.log("workingg")

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({ message: "User logged in successfully", token});
    } catch (error) {
        res.status(500).json({ message: "Error logging user", error: error.message });
    }
}


export const profile = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id).select('-password');

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile fetched successfully", data: { user } });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}