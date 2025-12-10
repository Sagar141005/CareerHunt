import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  RiMapPinLine,
  RiSettings4Line,
  RiSparkling2Fill,
  RiMenu4Line,
  RiCloseLine,
  RiDashboardLine,
  RiBriefcaseLine,
  RiBookmarkLine,
  RiFileListLine,
  RiFilePaperLine,
} from "@remixicon/react";
import { useAuth } from "../../context/AuthContext";

const UserNavbar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  const navLinks = [
    { name: "Home", path: "/dashboard", icon: RiDashboardLine },
    { name: "Find Job", path: "/jobs", icon: RiBriefcaseLine },
    { name: "Saved", path: "/saved", icon: RiBookmarkLine },
    { name: "Applications", path: "/my-applications", icon: RiFileListLine },
    { name: "Resume", path: "/resume", icon: RiFilePaperLine },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 group"
            aria-label="Go to dashboard"
          >
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <RiSparkling2Fill
                size={20}
                className="text-blue-600  dark:text-blue-400"
              />
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              CareerHunt
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-blue-600"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <RiMapPinLine size={14} className="text-neutral-400" />
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 truncate max-w-[100px]">
              {user.location || "Remote"}
            </span>
          </div>

          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>

          <Link
            to="/setting"
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all"
            aria-label="Settings"
          >
            <RiSettings4Line size={20} />
          </Link>

          <Link to="/profile" className="relative group" aria-label="Profile">
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white dark:border-neutral-950 shadow-sm ring-2 ring-neutral-100 dark:ring-neutral-800 group-hover:ring-blue-100 dark:group-hover:ring-blue-900 transition-all">
              <img
                className="w-full h-full object-cover"
                src={
                  user.profilePic ||
                  "https://ui-avatars.com/api/?name=" +
                    user.name +
                    "&background=0164FC&color=fff"
                }
                alt="Profile"
              />
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-950" />
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {menuOpen ? <RiCloseLine size={24} /> : <RiMenu4Line size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      active
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={active ? "text-blue-600" : "text-neutral-400"}
                    />
                    {link.name}
                  </Link>
                );
              })}

              <div className="mt-4 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <RiMapPinLine size={18} />
                <span>
                  Current Location:{" "}
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {user.location || "Remote"}
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default UserNavbar;
