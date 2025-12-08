import Resume from "../models/resume.js";
import {
  improveSectionText,
  generateCoverLetter,
} from "../utils/openaiClient.js";

export const createResume = async (req, res) => {
  try {
    const user = req.user._id;
    const { personal, experience, education, skills, title, theme, color } =
      req.body;

    const newResume = await Resume.create({
      user,
      title: title || personal?.name || "My Resume",
      personal,
      experience,
      education,
      skills,
      theme: theme || "modern",
      color: color || "#2563eb",
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    const resume = await Resume.findOne({ _id: id, user });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching resume", error: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;
    const updateData = { ...req.body };

    if (updateData.personal?.name) {
      updateData.title = `${updateData.personal.name}'s Resume`;
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, user },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const user = req.user._id;
    const resumes = await Resume.find({ user })
      .select("title updatedAt personal.profession personal.fullName")
      .sort({ updatedAt: -1 });

    res.status(200).json({ resumes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    await Resume.findOneAndDelete({ _id: id, user });
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

export const improveText = async (req, res) => {
  try {
    const { text, type, jobDescription } = req.body;

    if (!text) return res.status(400).json({ message: "Text is required" });

    const improvedText = await improveSectionText(text, type, jobDescription);

    res.status(200).json({ success: true, improvedText });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "AI improvement failed", error: error.message });
  }
};

export const createCoverLetter = async (req, res) => {
  try {
    const { resumeData, jobPost } = req.body;

    if (!resumeData || !jobPost) {
      return res.status(400).json({ message: "Missing resume or job data" });
    }

    const letter = await generateCoverLetter(resumeData, jobPost);

    res.status(200).json({ success: true, coverLetter: letter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cover letter generation failed" });
  }
};
