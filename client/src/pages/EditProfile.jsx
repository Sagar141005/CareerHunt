import React, { Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import MDEditor from "@uiw/react-md-editor";
import {
  RiArrowLeftLine,
  RiUserLine,
  RiMapPinLine,
  RiBuildingLine,
  RiGlobalLine,
  RiUploadCloud2Line,
  RiBriefcaseLine,
} from "@remixicon/react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { useTheme } from "@emotion/react";

const EditProfile = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    profilePic: "",
    bio: "",
    location: "",
    designation: "",
    company: {
      name: "",
      logoUrl: "",
      website: "",
      location: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("company.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        company: { ...prev.company, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImage = async (e) => {
    const { name, files } = e.target;
    if (!files.length) return;

    const file = files[0];
    const imageFormData = new FormData();
    imageFormData.append("file", file);
    imageFormData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    const toastId = toast.loading("Uploading image...");

    try {
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: imageFormData,
      });
      const data = await res.json();
      const url = data.secure_url;

      if (name === "profilePic") {
        setFormData((prev) => ({ ...prev, profilePic: url }));
      } else if (name === "company.logoUrl") {
        setFormData((prev) => ({
          ...prev,
          company: { ...prev.company, logoUrl: url },
        }));
      }
      toast.update(toastId, {
        render: "Image uploaded!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Upload failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (!loading && user) {
      setFormData({
        name: user.name || "",
        profilePic: user.profilePic || "",
        bio: user.bio || "",
        location: user.location || "",
        designation: user.designation || "",
        company: {
          name: user.company?.name || "",
          logoUrl: user.company?.logoUrl || "",
          website: user.company?.website || "",
          location: user.company?.location || "",
        },
      });
    }
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("auth/profile", formData);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      toast.error(msg);
    }
  };

  const ImageUploader = ({ label, image, name, onChange, isRound = false }) => (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
      <div className="flex items-center gap-4">
        <div
          className={`shrink-0 w-20 h-20 border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 overflow-hidden flex items-center justify-center ${
            isRound ? "rounded-full" : "rounded-xl"
          }`}
        >
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <RiUserLine className="text-neutral-400" size={32} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
            <RiUploadCloud2Line size={18} />
            <span>Upload New</span>
            <input
              type="file"
              name={name}
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Recommended: 400x400px, JPG or PNG.
          </p>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0164FC] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <RiArrowLeftLine size={18} /> Back to Profile
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Edit Profile
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your public profile and account settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
              <RiUserLine className="text-[#0164FC]" size={20} /> Personal Info
            </h2>

            <div className="space-y-6">
              <ImageUploader
                label="Profile Picture"
                image={formData.profilePic}
                name="profilePic"
                onChange={handleImage}
                isRound={true}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={RiUserLine}
                  placeholder="e.g. Jane Doe"
                />
                <InputField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  icon={RiMapPinLine}
                  placeholder="e.g. New York, USA"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Bio
                </label>
                <div
                  className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
                  data-color-mode={theme}
                >
                  <Suspense fallback={<Loader />}>
                    <MDEditor
                      value={formData.bio}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, bio: value || "" }))
                      }
                      preview="edit"
                      height={200}
                      className="!border-none"
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>

          {user.role === "recruiter" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <RiBuildingLine className="text-[#0164FC]" size={20} /> Company
                Details
              </h2>

              <div className="space-y-6">
                <ImageUploader
                  label="Company Logo"
                  image={formData.company.logoUrl}
                  name="company.logoUrl"
                  onChange={handleImage}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Your Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    icon={RiBriefcaseLine}
                    placeholder="e.g. HR Manager"
                  />
                  <InputField
                    label="Company Name"
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleChange}
                    icon={RiBuildingLine}
                    placeholder="e.g. Acme Corp"
                  />
                  <InputField
                    label="Website"
                    name="company.website"
                    value={formData.company.website}
                    onChange={handleChange}
                    icon={RiGlobalLine}
                    placeholder="e.g. https://acme.com"
                  />
                  <InputField
                    label="HQ Location"
                    name="company.location"
                    value={formData.company.location}
                    onChange={handleChange}
                    icon={RiMapPinLine}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end items-center gap-4 pt-4">
            <Link
              to="/profile"
              className="px-4 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </Link>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
