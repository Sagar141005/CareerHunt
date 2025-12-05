import React from "react";
import { motion } from "motion/react";
import {
  RiRobotLine,
  RiAppsLine,
  RiBarChartBoxLine,
  RiUserSearchLine,
  RiFlashlightLine,
  RiTeamLine,
} from "@remixicon/react";

const WhyChooseUs = () => {
  const features = [
    {
      title: "AI-Powered Intelligence",
      desc: "Our engine parses thousands of job descriptions to tailor your resume keywords perfectly against the ATS.",
      icon: <RiRobotLine size={32} />,
      bgIcon: <RiRobotLine size={240} />,
      gridArea: "md:col-span-2 md:row-span-2",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "hover:border-blue-500/50",
    },
    {
      title: "Lightning Fast",
      desc: "Zero latency. Built on edge networks for instant updates across all devices.",
      icon: <RiFlashlightLine size={32} />,
      bgIcon: <RiFlashlightLine size={180} />,
      gridArea: "md:col-span-1 md:row-span-2",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/10",
      border: "hover:border-amber-500/50",
    },
    {
      title: "All-in-One",
      desc: "Search, apply, and track. One tab rule.",
      icon: <RiAppsLine size={32} />,
      bgIcon: <RiAppsLine size={120} />,
      gridArea: "md:col-span-1 md:row-span-1",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/10",
      border: "hover:border-purple-500/50",
    },
    {
      title: "Recruiter Access",
      desc: "Direct visibility to hiring managers.",
      icon: <RiUserSearchLine size={32} />,
      bgIcon: <RiUserSearchLine size={120} />,
      gridArea: "md:col-span-1 md:row-span-2",
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-900/10",
      border: "hover:border-pink-500/50",
    },
    {
      title: "Proven Analytics",
      desc: "92% of users land interviews within 30 days. Visualize your success funnel.",
      icon: <RiBarChartBoxLine size={32} />,
      bgIcon: <RiBarChartBoxLine size={150} />,
      gridArea: "md:col-span-1 md:row-span-1",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
      border: "hover:border-emerald-500/50",
    },
    {
      title: "Global Community",
      desc: "Join 100,000+ professionals sharing salary insights and referral tips.",
      icon: <RiTeamLine size={32} />,
      bgIcon: <RiTeamLine size={150} />,
      gridArea: "md:col-span-2 md:row-span-1",
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-900/10",
      border: "hover:border-cyan-500/50",
    },
  ];

  return (
    <section className="py-32 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6">
              Why top talent{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-transparent bg-clip-text">
                Chooses Us.
              </span>
            </h3>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              We've engineered the perfect toolkit to give you an unfair
              advantage in the job market.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -5 }}
              className={`
                relative group overflow-hidden 
                rounded-3xl p-8 
                ${feature.gridArea} 
                bg-white dark:bg-blue-900/10
                border border-neutral-200 dark:border-white/5 
                shadow-sm hover:shadow-2xl hover:shadow-neutral-200/40 dark:hover:shadow-none
                transition-all duration-300
                ${feature.border}
              `}
            >
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center`}
                >
                  {feature.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>

              <div
                className={`
                  absolute -bottom-4 -right-4 
                  opacity-[0.03] dark:opacity-[0.05] 
                  group-hover:opacity-[0.08] dark:group-hover:opacity-[0.08] 
                  group-hover:scale-110 group-hover:-rotate-12
                  transition-all duration-500 
                  ${feature.color} 
                  pointer-events-none
                `}
              >
                {feature.bgIcon}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
