import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }, 
    profilePic: {
        type: String
    },
    bio: {
        type: String
    }, 
    location: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [11, "Enter a valid email."]
    }, 
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['jobseeker', 'recruiter'],
        default: 'jobseeker'
    }
}, { timestamps: true, strict: true });

UserSchema.pre("save", async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', UserSchema);

export default User;