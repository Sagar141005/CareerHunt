import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import CompaniesAndFeatures from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChoseUs";
import CTA from "../components/home/CTA";
import { RiBriefcase2Line, RiUserSearchLine } from "@remixicon/react";
import Button from "../components/ui/Button";
import Heading from "../components/ui/Heading";
import Paragraph from "../components/ui/SubHeading";

const Home = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-x-hidden">
      <section className="relative max-w-7xl mx-auto min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]"></div>
          <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"></div>
        </div>

        <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Button variant="black">
                <Link to="/signup">Register</Link>
              </Button>
            </>
          ) : (
            <Button>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>

        <motion.div
          className="z-20 max-w-4xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <p className="text-xs font-medium tracking-wide uppercase text-neutral-600 dark:text-neutral-400">
              Trusted by 100,000+ professionals
            </p>
          </motion.div>

          <motion.h1 variants={itemVariants}>
            <Heading gradientText size="hero">
              Cut the Confusion.::Claim Your Career.
            </Heading>
          </motion.h1>

          <motion.p variants={itemVariants}>
            <Paragraph size="hero">
              AI-powered tools for candidates and recruiters. We stripped away
              the noise so you can focus on the offer.
            </Paragraph>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
          >
            <Button icon={RiBriefcase2Line} className="w-fit mx-auto">
              <Link to="/signup">I’m a Job Seeker</Link>
            </Button>
            <Button
              icon={RiUserSearchLine}
              className="w-fit mx-auto"
              variant="secondary"
            >
              <Link to="/signup">I’m a Recruiter</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 sm:mt-20 z-20 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="flex items-center justify-center -space-x-3 mb-4">
            {[
              "https://images.unsplash.com/photo-1560250097-0b93528c311a",
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
              "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50",
              "https://plus.unsplash.com/premium_photo-1670884442927-e647436e12ff",
            ].map((src, i) => (
              <img
                loading="lazy"
                key={i}
                src={`${src}?w=80&q=80`}
                className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-950 object-cover shadow-sm"
                alt="user"
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-950 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-sm z-10">
              <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300">
                +2k
              </span>
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            “Achieved a successful{" "}
            <span className="text-neutral-900 dark:text-white font-bold">
              job placement
            </span>{" "}
            in just 14 days.”
          </p>
        </motion.div>
      </section>

      <CompaniesAndFeatures />
      <HowItWorks />
      <Testimonials />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
