import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import redis from "../utils/redis.js";

export const signupUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role || 'jobseeker'
        });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully", data: { newUser } });
    } catch (error) {
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        if (user.provider !== 'local') {
            return res.status(403).json({ message: `Please login using ${user.provider}` });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h'});
        
        return res.status(200).json({ message: "User logged in successfully", user, token });
    } catch (error) {
        return res.status(500).json({ message: "Error logging in", error: error.message });
    }
}

export const storeRoleInSession = (req, res) => {
    const { role } = req.body;
    req.session.role = role;
    res.status(200).json({ message: 'Role stored in session' });
};

export const socialLogin = async (req, res) => {
    try {
        const passportUser = req.user;

        if(!passportUser || !passportUser.emails || !passportUser.emails.length) {
            return res.status(400).json({ message: 'No email received from provider' });
        } 

        const email = passportUser.emails[0].value;
        const name = passportUser.displayName || `${passportUser.name?.givenName || ''} ${passportUser.name?.familyName || ''}`.trim() || 'User';

        let user = await User.findOne({ email });

        if(!user) {
            const role = req.session.role || 'jobseeker';
            delete req.session.role;
            user = new User({
                name,
                email,
                role,
                provider: passportUser.provider || 'google',
                profilePic: passportUser.photos?.[0]?.value || ''
            });

            await user.save()
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
      
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.redirect(`${process.env.VITE_URL}/dashboard`);
    } catch (error) {
        return res.status(500).json({ message: 'Social auth error', error: error.message });
    }
}

export const profile = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id).select('-password');

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile fetched successfully",  user });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const { name, profilePic, bio, location, designation, company  } = req.body;

        const updatedFields = {};

        if (name !== undefined) updatedFields.name = name;
        if (profilePic !== undefined) updatedFields.profilePic = profilePic;
        if (bio !== undefined) updatedFields.bio = bio;
        if (location !== undefined) updatedFields.location = location;
        if (designation !== undefined) updatedFields.designation = designation;

        if (company) {
            updatedFields.company = {};
            if (company.name !== undefined) updatedFields.company.name = company.name;
            if (company.logoUrl !== undefined) updatedFields.company.logoUrl = company.logoUrl;
            if (company.website !== undefined) updatedFields.company.website = company.website;
            if (company.location !== undefined) updatedFields.company.location = company.location;
        }

        if(updatedFields.company && Object.keys(updatedFields.company).length === 0) {
            delete updatedFields.company;
        }

        const updatedUser = await User.findByIdAndUpdate( id, updatedFields, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}

export const changePassword = async (req, res) => {
    try {
        const id = req.user._id;
        const { oldPassword, newPassword  } = req.body;

        if(!oldPassword || !newPassword) {
            return res.status(404).json({ message: "Password missing" });
        }

        const user = await User.findById(id).select('+password');
        const isMatch = await user.comparePassword(oldPassword);

        if(!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
        
    } catch (error) {
        return res.status(500).json({ message: "Error updating password", error: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
          const decoded = jwt.decode(token);
          const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // in seconds
    
          // Save token in Redis blacklist with TTL
          await redis.set(`bl_${token}`, '1', 'EX', expiresIn);
        }
    
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed", error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.user._id;

        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}