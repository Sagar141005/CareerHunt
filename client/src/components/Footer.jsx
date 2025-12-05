import React from "react";
import { Link } from "react-router-dom";
import {
  RiLinkedinFill,
  RiSparkling2Fill,
  RiTwitterXFill,
} from "@remixicon/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const LinkGroup = ({ title, links }) => (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <div className="flex flex-col space-y-2.5">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className="text-sm text-neutral-500 hover:text-blue-600 dark:text-neutral-400 transition-colors duration-200 w-fit"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <footer className="w-full bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <Link to="/" className="flex items-center gap-2 w-fit group">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                <RiSparkling2Fill size={20} className="text-blue-600" />
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                CareerHunt
              </span>
            </Link>

            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-sm">
              Empowering job seekers and recruiters with AI-driven tools. We
              strip away the noise so you can focus on the offer.
            </p>

            <div className="flex gap-3 pt-2">
              <a
                href="https://x.com/not_sagar1410"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-950 hover:text-white dark:hover:text-white transition-all duration-300"
              >
                <RiTwitterXFill size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/notsagarsaini/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linkedin"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300"
              >
                <RiLinkedinFill size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <LinkGroup
              title="For Job Seekers"
              links={[
                { label: "Apply for Jobs", to: "/jobs" },
                { label: "Resume Analyzer", to: "/resume" },
                { label: "Application Tracker", to: "/my-applications" },
              ]}
            />

            <LinkGroup
              title="For Recruiters"
              links={[
                { label: "Post a Job", to: "/post/job" },
                { label: "Manage Listings", to: "/job/posts" },
              ]}
            />

            <LinkGroup
              title="Company"
              links={[
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
              ]}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center md:text-left">
            © {currentYear} CareerHunt Inc. All rights reserved.
          </p>

          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 animate-pulse bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                All systems normal
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
