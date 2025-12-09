import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { RiArrowRightLine, RiBriefcase2Line } from "@remixicon/react";

const CTASection = () => {
  return (
    <section className="py-24 px-4 transition-colors duration-500">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-blue-600 dark:bg-blue-700 shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full border-[40px] border-white/5 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full border-[40px] border-white/5 pointer-events-none"></div>

        <div className="relative z-10 px-8 py-16 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Ready to find your match?
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Join a platform where real talent meets real opportunity. No
              noise, just connections.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold rounded-lg text-blue-600 bg-white border border-white shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                Start Looking <RiArrowRightLine size={20} />
              </Link>

              <Link
                to="/signup?role=recruiter"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-transparent text-white border border-neutral-100 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-sm"
              >
                Post a Job <RiBriefcase2Line size={20} />
              </Link>
            </div>
            <div className="mt-10 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Simple setup</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-blue-100"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Verified profiles</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
