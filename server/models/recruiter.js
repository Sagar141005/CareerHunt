import mongoose from 'mongoose'

const RecruiterProfileSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      required: true
    },
    companyLogo: { 
        type: String 
    },
    position: String,
  });
  
  export const RecruiterProfile = mongoose.model('RecruiterProfile', RecruiterProfileSchema);
  