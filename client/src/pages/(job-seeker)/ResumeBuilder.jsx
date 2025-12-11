import React, { useState, useEffect, useRef } from "react";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import {
  RiUser3Line,
  RiBriefcase2Line,
  RiGraduationCapLine,
  RiPencilRuler2Line,
  RiFolder6Line,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiSave3Line,
  RiLoader4Line,
  RiDownloadLine,
  RiPaletteLine,
  RiCheckLine,
  RiLayoutMasonryLine,
} from "@remixicon/react";
import Button from "../../components/ui/Button";
import ResumePreview from "../../components/resume/ResumePreview";
import ResumeForm from "../../components/resume/ResumeForm";
import { useAuth } from "../../context/AuthContext";

const initialResumeState = {
  title: "Untitled Resume",
  theme: "modern",
  color: "#2563eb",
  personal: {
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    location: "",
    linkedin: "",
    website: "",
    imageUrl: "",
    summary: "",
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
};

const colors = [
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Emerald", hex: "#059669" },
  { name: "Rose Pink", hex: "#E11D48" },
  { name: "Soft Pink", hex: "#F472B6" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Crimson", hex: "#dc2626" },
  { name: "Slate", hex: "#475569" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Black", hex: "#000000" },
];

const ResumeBuilder = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = id && id !== "new";
  const imageInputRef = useRef(null);

  const [data, setData] = useState(initialResumeState);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [aiLoading, setAiLoading] = useState({ section: null, id: null });
  const [skillInput, setSkillInput] = useState("");

  const steps = [
    { key: "personal", label: "Personal Info", icon: RiUser3Line },
    { key: "experience", label: "Experience", icon: RiBriefcase2Line },
    { key: "projects", label: "Projects", icon: RiFolder6Line },
    { key: "education", label: "Education", icon: RiGraduationCapLine },
    { key: "skills", label: "Skills", icon: RiPencilRuler2Line },
    { key: "design", label: "Design & Theme", icon: RiPaletteLine },
  ];

  const themes = [
    {
      id: "modern",
      name: "Modern Blue",
      color: "bg-blue-100",
      desc: "Clean & ATS Friendly",
    },
    {
      id: "professional",
      name: "Classic Serif",
      color: "bg-gray-200",
      desc: "Traditional & Formal",
    },
    {
      id: "creative",
      name: "Creative Sidebar",
      color: "bg-emerald-100",
      desc: "Bold & Standout",
    },
  ];

  useEffect(() => {
    if (!isEditing && user) {
      setData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.name || "",
          email: user.email || "",
          location: user.location || "",
          summary: user.bio || "",
          imageUrl: user.profilePic || "",
        },
      }));
    }
  }, [isEditing, user]);

  useEffect(() => {
    const fetchResume = async () => {
      if (!isEditing) return;
      try {
        const response = await api.get(`/ai/resume/${id}`);
        if (response.data.success) {
          let fetchedData = response.data.resume;

          if (!fetchedData.theme) fetchedData.theme = "modern";

          if (typeof fetchedData.skills === "string") {
            fetchedData.skills = fetchedData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s);
          }

          setData({
            ...initialResumeState,
            ...fetchedData,
          });
        }
      } catch (error) {
        toast.error("Failed to load resume.");
        navigate("/resume");
      }
    };
    fetchResume();
  }, [id, isEditing, navigate]);

  const handleThemeChange = (themeId) => {
    setData((prev) => ({ ...prev, theme: themeId }));
  };

  const handlePersonalChange = (e) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [e.target.name]: e.target.value },
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

      const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setData((prev) => ({
        ...prev,
        personal: { ...prev.personal, imageUrl: data.secure_url },
      }));
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Image upload failed.");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleArrayChange = (section, id, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = (section, template) => {
    setData((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...template, id: Date.now() }],
    }));
  };

  const deleteItem = (section, id) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!data.skills.includes(skillInput.trim())) {
        setData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        skills: data.skills.join(", "),
        theme: data.theme,
        color: data.color,
      };

      if (isEditing) {
        await api.put(`/ai/resume/${id}`, payload);
        toast.success("Resume updated!");
      } else {
        const res = await api.post("/ai/resume/create", payload);
        toast.success("Resume created!");
        navigate(`/resume/builder/${res.data.resume._id}`, { replace: true });
      }
    } catch (error) {
      toast.error("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  const handleEnhance = async (section, id, field, currentValue, type) => {
    if (!currentValue || currentValue.length < 5) {
      toast.error("Please provide a rough draft first!");
      return;
    }
    setAiLoading({ section, id });
    try {
      const response = await api.post("/ai/resume/ai/enhance", {
        text: currentValue,
        type: type,
      });

      if (response.data.success) {
        const improvedText = response.data.improvedText;
        if (section === "personal") {
          setData((prev) => ({
            ...prev,
            personal: { ...prev.personal, [field]: improvedText },
          }));
        } else {
          handleArrayChange(section, id, field, improvedText);
        }
        toast.success("Enhanced by AI ✨");
      }
    } catch (error) {
      toast.error("AI enhancement failed.");
    } finally {
      setAiLoading({ section: null, id: null });
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const handleColorChange = (colorHex) => {
    setData((prev) => ({ ...prev, color: colorHex }));
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 overflow-hidden transition-colors duration-300 print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <UserNavbar />
      </div>
      <div className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/resume")}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 transition-colors"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800"></div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
            Resume Editor
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleDownload}
            className="hidden sm:flex items-center gap-2"
            variant="secondary"
            icon={RiDownloadLine}
          >
            <span className="hidden md:inline">Download PDF</span>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RiLoader4Line className="animate-spin" size={18} />
            ) : (
              <>
                Save <RiSave3Line size={18} />
              </>
            )}
          </Button>
        </div>
      </div>

      <main className="flex-grow flex h-[calc(100vh-128px)] print:h-auto print:block">
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-full z-20 print:hidden">
          <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {steps.map((step, index) => {
                const isActive = currentStep === index;

                return (
                  <button
                    key={step.key}
                    onClick={() => setCurrentStep(index)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-200 dark:ring-blue-800"
                          : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200"
                      }
                    `}
                  >
                    {React.createElement(step.icon, { size: 18 })}
                    <span
                      className={`${isActive ? "inline" : "hidden xl:inline"}`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {steps[currentStep].key === "design" ? (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                    <RiPaletteLine size={16} className="text-blue-600" /> Accent
                    Color
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => handleColorChange(c.hex)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-black/10`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {data.color === c.hex && (
                          <RiCheckLine
                            size={20}
                            className="text-white drop-shadow-md"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-neutral-100 dark:bg-neutral-800"></div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                    <RiLayoutMasonryLine size={16} className="text-blue-600" />{" "}
                    Layout Template
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${
                          data.theme === theme.id
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-blue-300"
                        }`}
                      >
                        <div
                          className={`w-12 h-16 ${theme.color} rounded shadow-sm border border-black/5`}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-900 dark:text-white">
                            {theme.name}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {theme.desc}
                          </p>
                        </div>
                        {data.theme === theme.id && (
                          <div className="text-blue-600 dark:text-blue-400">
                            <RiCheckLine size={24} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ResumeForm
                activeStep={steps[currentStep].key}
                data={data}
                setData={setData}
                aiLoading={aiLoading}
                handlePersonalChange={handlePersonalChange}
                handleArrayChange={handleArrayChange}
                handleEnhance={handleEnhance}
                deleteItem={deleteItem}
                addItem={addItem}
                imageInputRef={imageInputRef}
                handleImageUpload={handleImageUpload}
                uploadingImg={uploadingImg}
                removeSkill={removeSkill}
                handleAddSkill={handleAddSkill}
                skillInput={skillInput}
                setSkillInput={setSkillInput}
              />
            )}
          </div>

          <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex justify-between">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((c) => c - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RiArrowLeftLine size={18} /> Previous
            </button>
            <Button
              onClick={() =>
                currentStep === steps.length - 1
                  ? handleSave()
                  : setCurrentStep((c) => c + 1)
              }
              icon={RiArrowRightLine}
              variant="black"
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>

        <div
          className="hidden lg:flex flex-1 bg-neutral-100/50 dark:bg-black/40 items-start justify-center p-5 overflow-y-auto relative custom-scrollbar 
          print:p-0 print:m-0 print:bg-white print:block print:w-full print:h-auto print:overflow-visible print:static"
        >
          <ResumePreview data={data} />
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
