import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  id: { type: Number },
  role: { type: String, default: "" },
  company: { type: String, default: "" },
  duration: { type: String, default: "" },
  details: { type: String, default: "" },
});

const EducationSchema = new mongoose.Schema({
  id: { type: Number },
  degree: { type: String, default: "" },
  school: { type: String, default: "" },
  year: { type: String, default: "" },
});

const ProjectSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, default: "" },
  link: { type: String, default: "" },
  description: { type: String, default: "" },
  technologies: { type: String, default: "" },
});

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Resume",
    },
    theme: {
      type: String,
      default: "modern",
    },
    color: {
      type: String,
      default: "#2563eb",
    },
    personal: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      profession: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    projects: [ProjectSchema],
    skills: { type: String, default: "" },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;
