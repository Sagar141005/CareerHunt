import React from "react";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiLoader4Line,
  RiUser3Line,
} from "@remixicon/react";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";

const ResumeForm = ({
  activeStep,
  data,
  setData,
  aiLoading,
  handlePersonalChange,
  handleArrayChange,
  handleEnhance,
  deleteItem,
  addItem,
  imageInputRef,
  handleImageUpload,
  uploadingImg,
  removeSkill,
  handleAddSkill,
  skillInput,
  setSkillInput,
}) => {
  switch (activeStep) {
    case "personal":
      return (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-4">
            <div
              onClick={() => imageInputRef.current?.click()}
              className="relative w-24 h-24 rounded-lg border-1 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center cursor-pointer hover:border-blue-600 overflow-hidden group transition-all"
            >
              {data.personal.imageUrl ? (
                <img
                  src={data.personal.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-neutral-400 group-hover:text-blue-600 flex flex-col items-center gap-1">
                  <RiUser3Line size={24} />
                  <span className="text-[10px] uppercase font-bold">
                    Upload
                  </span>
                </div>
              )}
              {uploadingImg && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <RiLoader4Line className="text-white animate-spin" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />

            <div className="flex-1 space-y-1">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                Resume Title
              </label>
              <input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full p-2 bg-transparent border-b-2 border-neutral-200 dark:border-neutral-700 focus:border-blue-600 outline-none text-lg font-medium text-neutral-900 dark:text-white transition-colors placeholder-neutral-300"
                placeholder="e.g. Senior Frontend Resume"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <InputField
              label="Full Name"
              name="fullName"
              value={data.personal.fullName}
              onChange={handlePersonalChange}
              placeholder="John Doe"
            />
            <InputField
              label="Profession / Role"
              name="profession"
              value={data.personal.profession}
              onChange={handlePersonalChange}
              placeholder="Software Engineer"
            />
            <InputField
              label="Email"
              name="email"
              value={data.personal.email}
              onChange={handlePersonalChange}
              placeholder="john@example.com"
              half
            />
            <InputField
              label="Phone"
              name="phone"
              value={data.personal.phone}
              onChange={handlePersonalChange}
              placeholder="+1 234 567 890"
              half
            />
            <InputField
              label="Location"
              name="location"
              value={data.personal.location}
              onChange={handlePersonalChange}
              placeholder="City, Country"
              half
            />
            <InputField
              label="Portfolio URL"
              name="website"
              value={data.personal.website}
              onChange={handlePersonalChange}
              placeholder="mysite.com"
              half
            />
            <InputField
              label="LinkedIn URL"
              name="linkedin"
              value={data.personal.linkedin}
              onChange={handlePersonalChange}
              placeholder="linkedin.com/in/john"
            />

            <TextAreaField
              label="Professional Summary"
              name="summary"
              value={data.personal.summary}
              onChange={handlePersonalChange}
              placeholder="Briefly describe your career highlights..."
              onEnhance={() =>
                handleEnhance(
                  "personal",
                  null,
                  "summary",
                  data.personal.summary,
                  "summary"
                )
              }
              loading={aiLoading.section === "personal"}
            />
          </div>
        </div>
      );

    case "experience":
      return (
        <div className="space-y-6 animate-fade-in">
          {data.experience.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 relative group bg-white dark:bg-neutral-900 shadow-sm hover:border-blue-200 transition-colors"
            >
              <button
                onClick={() => deleteItem("experience", exp.id)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
              >
                <RiDeleteBinLine size={18} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Work History
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Job Title"
                  value={exp.role}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      exp.id,
                      "role",
                      e.target.value
                    )
                  }
                  placeholder="Product Manager"
                  half
                />
                <InputField
                  label="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      exp.id,
                      "company",
                      e.target.value
                    )
                  }
                  placeholder="Acme Corp"
                  half
                />
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <InputField
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleArrayChange(
                        "experience",
                        exp.id,
                        "startDate",
                        e.target.value
                      )
                    }
                    half
                  />
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide flex justify-between">
                      End Date
                      <label className="flex items-center gap-2 cursor-pointer text-blue-600 normal-case font-medium">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) =>
                            handleArrayChange(
                              "experience",
                              exp.id,
                              "isCurrent",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        Present
                      </label>
                    </label>
                    <input
                      type="month"
                      value={exp.endDate}
                      disabled={exp.isCurrent}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          exp.id,
                          "endDate",
                          e.target.value
                        )
                      }
                      className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm text-neutral-900 dark:text-white disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900"
                    />
                  </div>
                </div>

                <TextAreaField
                  label="Responsibilities"
                  value={exp.details}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      exp.id,
                      "details",
                      e.target.value
                    )
                  }
                  placeholder="Describe your impact..."
                  onEnhance={() =>
                    handleEnhance(
                      "experience",
                      exp.id,
                      "details",
                      exp.details,
                      "experience"
                    )
                  }
                  loading={aiLoading.id === exp.id}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addItem("experience", {
                role: "",
                company: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
                details: "",
              })
            }
            className="w-full px-4 py-2 text-sm border-1 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex justify-center gap-2 transition-all font-semibold"
          >
            <RiAddLine /> Add Position
          </button>
        </div>
      );

    case "projects":
      return (
        <div className="space-y-6 animate-fade-in">
          {data.projects.map((proj, index) => (
            <div
              key={proj.id}
              className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 relative bg-white dark:bg-neutral-900 shadow-sm"
            >
              <button
                onClick={() => deleteItem("projects", proj.id)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
              >
                <RiDeleteBinLine size={18} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Project
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Project Title"
                  value={proj.title}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      proj.id,
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="App Name"
                  half
                />
                <InputField
                  label="Link"
                  value={proj.link}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      proj.id,
                      "link",
                      e.target.value
                    )
                  }
                  placeholder="URL"
                  half
                />
                <InputField
                  label="Tech Stack"
                  value={proj.technologies}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      proj.id,
                      "technologies",
                      e.target.value
                    )
                  }
                  placeholder="React, Node"
                />
                <TextAreaField
                  label="Description"
                  value={proj.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      proj.id,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="What did you build?"
                  onEnhance={() =>
                    handleEnhance(
                      "projects",
                      proj.id,
                      "description",
                      proj.description,
                      "project"
                    )
                  }
                  loading={aiLoading.id === proj.id}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addItem("projects", {
                title: "",
                link: "",
                technologies: "",
                description: "",
              })
            }
            className="w-full px-4 py-2 text-sm border-1 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex justify-center gap-2 transition-all font-semibold"
          >
            <RiAddLine /> Add Project
          </button>
        </div>
      );

    case "education":
      return (
        <div className="space-y-6 animate-fade-in">
          {data.education.map((edu, index) => (
            <div
              key={edu.id}
              className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 relative bg-white dark:bg-neutral-900 shadow-sm"
            >
              <button
                onClick={() => deleteItem("education", edu.id)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
              >
                <RiDeleteBinLine size={18} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Education
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="School"
                  value={edu.school}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      edu.id,
                      "school",
                      e.target.value
                    )
                  }
                  placeholder="University"
                />
                <InputField
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      edu.id,
                      "degree",
                      e.target.value
                    )
                  }
                  placeholder="BSc Comp Sci"
                  half
                />
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                    Graduation Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      handleArrayChange(
                        "education",
                        edu.id,
                        "endDate",
                        e.target.value
                      )
                    }
                    className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-blue-600 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addItem("education", { school: "", degree: "", endDate: "" })
            }
            className="w-full px-4 py-2 text-sm border-1 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex justify-center gap-2 transition-all font-semibold"
          >
            <RiAddLine /> Add Education
          </button>
        </div>
      );

    case "skills":
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
              Add Skills
            </label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type a skill and hit Enter (e.g. React)"
                className="flex-1 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10   outline-none text-sm"
              />
              <button
                onClick={() => {
                  if (skillInput.trim()) {
                    setData((prev) => ({
                      ...prev,
                      skills: [...prev.skills, skillInput.trim()],
                    }));
                    setSkillInput("");
                  }
                }}
                className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 px-4 rounded-lg transition-colors"
              >
                <RiAddLine />
              </button>
            </div>
            <p className="text-xs text-neutral-400">Press Enter to add tags</p>
          </div>

          <div className="flex flex-wrap gap-2 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg min-h-[100px]">
            {data.skills.length === 0 && (
              <span className="text-sm text-neutral-400">
                No skills added yet.
              </span>
            )}
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 shadow-sm group"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <RiCloseLine size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default ResumeForm;
