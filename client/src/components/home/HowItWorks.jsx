import React from "react";
import { motion } from "framer-motion";
import { RiArticleLine, RiListCheck3, RiRocketLine } from "@remixicon/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const iconSpring = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.1,
    y: -5,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Create Profile",
      desc: "Upload your resume or LinkedIn PDF. Our AI parses your history to build a live, interactive portfolio instantly.",
      icon: <RiArticleLine size={32} />,
    },
    {
      num: "02",
      title: "Track Applications",
      desc: "Apply to jobs with one click and let our system automatically organize them for you.",
      icon: <RiListCheck3 size={32} />,
    },
    {
      num: "03",
      title: "Get Matched",
      desc: "Our algorithm matches your verified skills with recruiters hiring now, skipping the resume black hole.",
      icon: <RiRocketLine size={32} />,
    },
  ];

  return (
    <section className="py-32 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-3xl mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            From search to signature, <br />
            <span className="text-neutral-400 dark:text-neutral-500">
              simplified.
            </span>
          </h3>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl">
            We stripped away the noise of traditional job boards to focus on
            what actually gets you hired: Speed and Visibility.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 border border-neutral-200 dark:border-white/10 rounded-3xl divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-white/10 overflow-hidden bg-white dark:bg-[#0B1120]">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial="rest"
                whileHover="hover"
                className="group relative p-10 flex flex-col justify-between min-h-[320px] bg-transparent hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="text-6xl font-light text-neutral-200 dark:text-white/10 select-none font-mono tracking-tighter">
                    {step.num}
                  </span>

                  <motion.div
                    variants={iconSpring}
                    className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-800"
                  >
                    {step.icon}
                  </motion.div>
                </div>

                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {step.title}
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm sm:text-base">
                    {step.desc}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
