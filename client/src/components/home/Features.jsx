import React from "react";
import { motion } from "motion/react";
import {
  RiArticleLine,
  RiListCheck3,
  RiArrowRightLine,
  RiCheckboxCircleFill,
} from "@remixicon/react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const CompaniesAndFeatures = () => {
  const logos = [
    "Google",
    "Adobe",
    "Airbnb",
    "Amazon",
    "Meta",
    "Microsoft",
    "Bloomberg",
    "Netflix",
    "Spotify",
    "Tesla",
  ];

  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500 overflow-hidden">
      <section className="py-20 border-y border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-[#0B1120]/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Trusted by top talent from
          </p>
        </div>

        <div
          className="relative w-full overflow-hidden group"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          }}
        >
          <div className="flex w-max gap-16 animate-infinite-scroll">
            {[...logos, ...logos, ...logos].map((company, index) => (
              <div
                key={index}
                className="group/logo flex items-center justify-center cursor-pointer"
              >
                <img
                  loading="lazy"
                  src={`/${company}.svg`}
                  alt={`${company} logo`}
                  className="h-8 py-1 w-auto object-contain opacity-40 grayscale transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 group-hover/logo:scale-110 dark:invert dark:group-hover/logo:invert-0 dark:group-hover/logo:brightness-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto relative py-32 px-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-50/0 via-neutral-100/40 to-neutral-200/70 dark:from-neutral-950 dark:via-neutral-900/80 dark:to-neutral-800/90" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeInUp}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-6">
              Everything you need to <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-transparent bg-clip-text">
                Land the Offer.
              </span>
            </h2>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Stop relying on luck. We provide the science and tools to make
              your job search predictable.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="w-full lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[#009854]/10 text-[#009854]">
                  <RiArticleLine size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#009854]">
                  AI Resume Helper
                </h3>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-neutral-900 dark:text-white leading-tight">
                Build a resume that <br />
                beats the{" "}
                <span className="underline decoration-[#009854] decoration-4 underline-offset-4">
                  ATS bots.
                </span>
              </h2>

              <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                Stop guessing keywords. Our AI analyzes job descriptions and
                generates tailored, ATS-friendly bullets that highlight your
                best skills automatically.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Keyword Optimization",
                  "Instant Formatting",
                  "Grammar Check",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300 font-medium"
                  >
                    <RiCheckboxCircleFill
                      className="text-[#009854]"
                      size={20}
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/resume"
                className="w-fit group text-neutral-900 dark:text-white font-bold flex items-center gap-2 border-b-2 border-neutral-200 dark:border-neutral-700 pb-1 hover:border-[#009854] transition-colors"
              >
                Try Resume Builder
                <motion.span variants={{ hover: { x: 5 } }}>
                  <RiArrowRightLine size={18} className="text-[#009854]" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative group perspective-1000"
            >
              <motion.div
                initial={{ scale: 1, rotate: 0 }}
                whileHover={{
                  scale: 1.02,
                  rotate: -1,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900"
              >
                <img
                  loading="lazy"
                  className="w-full h-auto object-cover"
                  src="/AI_Resume.png"
                  alt="AI Resume Builder"
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="w-full lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[#DD258F]/10 text-[#DD258F]">
                  <RiListCheck3 size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#DD258F]">
                  Smart Job Tracker
                </h3>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-neutral-900 dark:text-white leading-tight">
                Never lose track of <br />
                an{" "}
                <span className="underline decoration-[#DD258F] decoration-4 underline-offset-4">
                  opportunity.
                </span>
              </h2>

              <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                No more tabs, notes, or scattered documents. Keep all your
                applications, statuses, and essential details in one clean,
                centralized workspace designed for clarity and momentum.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Track application stages clearly",
                  "Store job details & contacts",
                  "Keep notes for each opportunity",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300 font-medium"
                  >
                    <RiCheckboxCircleFill
                      className="text-[#DD258F]"
                      size={20}
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/applications"
                className="w-fit group text-neutral-900 dark:text-white font-bold flex items-center gap-2 border-b-2 border-neutral-200 dark:border-neutral-700 pb-1 hover:border-[#DD258F] transition-colors"
              >
                Start Tracking Free
                <motion.span variants={{ hover: { x: 5 } }}>
                  <RiArrowRightLine size={18} className="text-[#DD258F]" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative group"
            >
              <motion.div
                initial={{ scale: 1, rotate: 0 }}
                whileHover={{
                  scale: 1.02,
                  rotate: 1,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900"
              >
                <img
                  loading="lazy"
                  className="w-full h-auto object-cover"
                  src="/AI_Resume.png"
                  alt="Job Tracker Dashboard"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompaniesAndFeatures;
