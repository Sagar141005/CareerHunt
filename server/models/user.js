import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [11, "Enter a valid email."],
    },
    password: {
      type: String,
      select: false,
      minlength: 8,
    },
    provider: {
      type: String,
      enum: ["local", "google", "github", "linkedin"],
      default: "local",
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    company: {
      name: { type: String, trim: true },
      logoUrl: { type: String, trim: true },
      website: { type: String, trim: true, lowercase: true },
      location: { type: String, trim: true },
    },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter"],
      default: "jobseeker",
    },
  },
  { timestamps: true, strict: true }
);

UserSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
