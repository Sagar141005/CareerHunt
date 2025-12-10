import React, { useState } from "react";
import {
  RiBriefcaseLine,
  RiCollageLine,
  RiFileList3Line,
  RiSettings4Line,
  RiSparkling2Fill,
  RiMenu4Line,
  RiCloseLine,
  RiArrowRightSLine,
  RiAddLine,
} from "@remixicon/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const menuItem = [
  { label: "Dashboard", icon: RiCollageLine, path: "/dashboard" },
  { label: "Manage Jobs", icon: RiBriefcaseLine, path: "/job/posts" },
  { label: "Applicants", icon: RiFileList3Line, path: "/applications" },
  { label: "Settings", icon: RiSettings4Line, path: "/setting" },
];

const RecruiterPannel = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard")
      return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path))
      return true;
    return false;
  };

  return (
    <>
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
            <RiSparkling2Fill size={20} className="text-blue-600" />
          </div>
          <span className="font-bold text-lg text-neutral-900 dark:text-white tracking-tight">
            CareerHunt
          </span>
        </Link>
        <button
          onClick={toggleMenu}
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {isOpen ? <RiCloseLine size={24} /> : <RiMenu4Line size={24} />}
        </button>
      </div>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none"
        }`}
      >
        <div className="px-6 py-6 hidden sm:inline-block border-b border-neutral-100 dark:border-neutral-800/50">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <RiSparkling2Fill
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-none">
                CareerHunt
              </h1>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Recruiter
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 md:pt-6 pt-18 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Menu
          </p>
          {menuItem.map(({ label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors ${
                    active
                      ? "text-white"
                      : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                  }`}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <RiArrowRightSLine size={16} className="text-blue-200" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <Button variant="black" className="w-full">
            <Link
              to="/post/job"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <RiAddLine
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span>Post a Job</span>
            </Link>
          </Button>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group"
          >
            <div className="relative">
              <img
                src={
                  user?.profilePic ||
                  "https://ui-avatars.com/api/?name=" + user?.name
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 group-hover:border-blue-300 transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {user?.name || "Recruiter"}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                View Profile
              </p>
            </div>
          </Link>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default RecruiterPannel;
