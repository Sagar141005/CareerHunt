import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  RiMapPinLine,
  RiBriefcaseLine,
  RiBuildingLine,
  RiGlobalLine,
  RiSearchLine,
  RiMagicLine,
  RiPencilRuler2Line,
  RiAddCircleLine,
  RiGroupLine,
  RiArrowRightLine,
  RiPencilLine,
} from "@remixicon/react";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "@emotion/react";
import { LayoutProfile } from "../components/Layout";

const normalizeUrl = (url) => {
  if (!url) return "";

  if (/^[a-zA-Z]+:\/\//.test(url)) return url;

  return "https://" + url.trim();
};

const Profile = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const ActionCard = ({ to, title, desc, icon: Icon }) => (
    <Link
      to={to}
      className="group relative flex flex-col justify-between min-h-[180px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-none hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Icon size={24} />
          </div>
          <RiArrowRightLine
            className="text-neutral-300 group-hover:text-blue-600 dark:text-blue-400 transition-colors"
            size={24}
          />
        </div>
        <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          {title}
        </h4>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {desc}
        </p>
      </div>
    </Link>
  );

  return (
    <LayoutProfile user={user}>
      <main className="pb-20">
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 mb-8">
          <div className="relative max-w-7xl mx-auto">
            <div className="h-64 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <div className="px-6 md:px-12 pb-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                <div className="relative -mt-20 shrink-0">
                  <div className="w-40 h-40 rounded-full border-[6px] border-white dark:border-neutral-900 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        user.profilePic ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=0164FC&color=fff`
                      }
                      alt={user.name}
                    />
                  </div>
                </div>

                <div className="flex-1 mt-2 md:mt-4 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white capitalize mb-1">
                        {user.name}
                      </h1>
                      <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                        {user.designation ||
                          (user.role === "recruiter"
                            ? "Recruiter"
                            : "Job Seeker")}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {user.location && (
                          <div className="flex items-center gap-1.5">
                            <RiMapPinLine
                              size={16}
                              className="text-neutral-400"
                            />
                            {user.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 capitalize">
                          <RiBriefcaseLine
                            size={16}
                            className="text-neutral-400"
                          />
                          {user.role} Account
                        </div>
                      </div>

                      {user.bio && (
                        <div className="mt-4 max-w-2xl" data-color-mode={theme}>
                          <MDEditor.Markdown
                            source={user.bio}
                            style={{
                              backgroundColor: "transparent",
                              color: "inherit",
                              fontSize: "1rem",
                            }}
                            className="!text-neutral-600 dark:!text-neutral-300"
                          />
                        </div>
                      )}
                    </div>

                    <Button icon={RiPencilRuler2Line}>
                      <Link to="/profile/edit">Edit Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          {user.role === "recruiter" && user.company && (
            <section>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <RiBuildingLine
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />{" "}
                Company Details
              </h3>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-6 shadow-sm">
                <div className="w-16 h-16 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex items-center justify-center shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      user.company.logoUrl || "https://via.placeholder.com/64"
                    }
                    alt="Company Logo"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {user.company.name}
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-400 mt-1 mb-3">
                    {user.company.location}
                  </p>
                  {user.company.website && (
                    <a
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      href={normalizeUrl(user.company.website)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <RiGlobalLine size={16} />{" "}
                      {user.company.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          <section>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.role === "recruiter" ? (
                <>
                  <ActionCard
                    to="/post/job"
                    title="Post a Job"
                    desc="Create and publish new job listings to find the right talent quickly."
                    icon={RiAddCircleLine}
                  />
                  <ActionCard
                    to="/applications"
                    title="View Applicants"
                    desc="Review applications, filter candidates, and manage your pipeline."
                    icon={RiGroupLine}
                  />
                  <ActionCard
                    to="/profile/edit"
                    title="Update Company"
                    desc="Edit company details and branding to attract better candidates."
                    icon={RiBuildingLine}
                  />
                </>
              ) : (
                <>
                  <ActionCard
                    to="/jobs"
                    title="Find Jobs"
                    desc="Browse and apply to top job opportunities matching your skills."
                    icon={RiSearchLine}
                  />
                  <ActionCard
                    to="/resume"
                    title="Resume Builder"
                    desc="Use our AI tools to optimize your resume and get hired faster."
                    icon={RiMagicLine}
                  />
                  <ActionCard
                    to="/profile/edit"
                    title="Update Profile"
                    desc="Keep your skills and experience up to date for recruiters."
                    icon={RiPencilLine}
                  />
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {user.role === "recruiter" ? "" : <Footer />}
    </LayoutProfile>
  );
};

export default Profile;
