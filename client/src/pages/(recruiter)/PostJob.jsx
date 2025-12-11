import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiGroupLine,
  RiTimeLine,
  RiBuildingLine,
  RiGlobalLine,
  RiPriceTag3Line,
  RiCalendarEventLine,
  RiUploadCloud2Line,
  RiFileListLine,
  RiImageLine,
} from "@remixicon/react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    salary: "",
    openings: "",
    employmentType: "",
    level: "",
    department: "",
    deadline: "",
    tags: "",
    company: "",
    companyWebsite: "",
    companyLogo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    try {
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, companyLogo: data.secure_url }));
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Logo upload failed.";
      toast.error(`Error: ${msg}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/job-posts/create", {
        ...formData,
        salary: Number(formData.salary),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      toast.success("Job posted successfully!");
      navigate("/job/posts");
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Failed to post job.";
      toast.error(`Error: ${msg}`);
    }
  };

  useEffect(() => {
    if (user?.role === "recruiter" && user.company) {
      setFormData((prev) => ({
        ...prev,
        company: user.company.name || "",
        companyWebsite: user.company.website || "",
        companyLogo: user.company.logoUrl || "",
      }));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link
            to="/job/posts"
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <RiArrowLeftLine size={18} /> Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Post a New Job
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Create a detailed job listing to attract the best talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
              <RiBriefcaseLine className="text-blue-600" size={20} /> Job
              Details
            </h2>

            <div className="space-y-6">
              <InputField
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                icon={RiBriefcaseLine}
                placeholder="e.g. Senior Frontend Developer"
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <div
                  className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
                  data-color-mode={theme}
                >
                  <MDEditor
                    value={formData.description}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: value || "",
                      }))
                    }
                    height={280}
                    preview="edit"
                    className="!border-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Tags (Comma separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  icon={RiPriceTag3Line}
                  placeholder="e.g. React, Remote, UI"
                />
                <InputField
                  label="Application Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  icon={RiCalendarEventLine}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
              <RiFileListLine className="text-blue-600" size={20} />{" "}
              Requirements & Compensation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                icon={RiMapPinLine}
                placeholder="e.g. New York, NY"
                required
              />

              <SelectField
                label="Workplace Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                icon={RiBuildingLine}
                options={["On-site", "Remote", "Hybrid"]}
                required
              />

              <InputField
                label="Salary / CTC"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                icon={RiMoneyDollarCircleLine}
                placeholder="e.g. 50000"
                required
                min="0"
              />

              <InputField
                label="Openings"
                name="openings"
                type="number"
                value={formData.openings}
                onChange={handleChange}
                icon={RiGroupLine}
                required
                min="1"
                placeholder="e.g. 10"
              />

              <SelectField
                label="Employment Type"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                icon={RiTimeLine}
                options={[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Freelance",
                  "Internship",
                ]}
                required
              />

              <SelectField
                label="Experience Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                icon={RiBriefcaseLine}
                options={["Intern", "Junior", "Mid", "Senior", "Lead"]}
              />

              <SelectField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                icon={RiBuildingLine}
                options={[
                  "IT",
                  "Design",
                  "Marketing",
                  "Sales",
                  "Finance",
                  "HR",
                  "Other",
                ]}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
              <RiBuildingLine className="text-blue-600" size={20} /> Company
              Information
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Company Logo
                </span>
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-20 h-20 border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center">
                    {formData.companyLogo ? (
                      <img
                        src={formData.companyLogo}
                        alt="Preview"
                        className="w-full h-full object-cover content-center"
                      />
                    ) : (
                      <RiImageLine className="text-neutral-400" size={32} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <RiUploadCloud2Line size={18} />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Recommended: Square JPG or PNG.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  icon={RiBuildingLine}
                  placeholder="e.g. Acme Corp"
                  required
                />
                <InputField
                  label="Company Website"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  icon={RiGlobalLine}
                  placeholder="https://acme.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4">
            <Link
              to="/job/posts"
              className="px-4 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </Link>
            <Button type="submit">Publish Job Post</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
