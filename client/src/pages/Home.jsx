import React from "react";
import {
  RiAppsLine,
  RiArticleLine,
  RiBarChartBoxLine,
  RiFlashlightLine,
  RiListCheck3,
  RiRobotLine,
  RiRocketLine,
  RiTeamLine,
  RiUserSearchLine,
} from "@remixicon/react";
import Review from "../components/Review";
import { reviews } from "../data/reviews";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <section className="relative h-[90vh] lg:min-h-screen sm:h-1/3 flex flex-col items-center justify-center text-center px-6">
        {/* Login/Register */}
        <div className="absolute top-6 right-6 z-30 flex gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-transparent border border-[#0164FC] text-[#0164FC] hover:bg-blue-50 dark:hover:bg-blue-900 dark:border-blue-400 dark:text-blue-400 transition font-semibold px-5 py-2 rounded-lg cursor-pointer"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-[#0164FC] hover:bg-[#004fcb] transition text-white font-semibold px-5 py-2 rounded-lg shadow-sm cursor-pointer"
              >
                Register
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="bg-[#0164FC] hover:bg-[#004fcb] transition text-white font-semibold px-5 py-2 rounded-lg shadow-sm cursor-pointer"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-70 dark:opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        ></div>

        {/* Hero Text */}
        <div className="z-20">
          <p className="text-[#0164FC] dark:text-blue-400 font-semibold mb-3 tracking-wide uppercase text-center text-sm sm:text-base md:text-lg">
            Trusted by over 100,000 professionals
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            Cut the Confusion. <br />
            <span className="bg-gradient-to-r from-[#0164FC] to-[#00B5D8] text-transparent bg-clip-text">
              Claim Your Career.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            AI-powered tools for candidates and recruiters. Smarter job search
            starts here.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <Link
              to="/signup"
              className="bg-[#0164FC] hover:bg-[#004fcb] transition text-white font-bold rounded-xl shadow-md text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3 cursor-pointer"
            >
              I’m a Job Seeker
            </Link>
            <Link
              to="/signup?role=recruiter"
              className="bg-white border border-[#0164FC] text-[#0164FC] hover:bg-blue-50 dark:bg-gray-800 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700 transition font-bold rounded-xl text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3 cursor-pointer"
            >
              I’m a Recruiter
            </Link>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center z-20">
          <div className="flex justify-center -space-x-3 mb-2">
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
                className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 object-cover"
                alt="user"
              />
            ))}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            “I finally got noticed. Recruiters from Google and Amazon reached
            out within days.”
          </p>
        </div>
      </section>

      {/* Companies Section */}
      <div className='bg-transparent lg:h-48 sm:h-64 w-full flex flex-col items-center text-center px-4 sm:px-6 md:px-12"'>
        <div>
          <h2 className="text-[#1A1C1F] dark:text-gray-100 font-bold lg:text-3xl sm:text-2xl mt-12">
            Trusted by job seekers who've landed at top companies
          </h2>
          <h4 className="text-[#1A1C1F] dark:text-gray-400 lg:text-md sm:text-lg">
            Our users have secured positions at industry-leading companies such
            as
          </h4>
        </div>
        <div className="overflow-hidden w-full mt-8">
          <div className="scroll-horizontal">
            <div className="flex items-center gap-12 pr-12 mix-blend-color-burn">
              <img loading="lazy" src="/Google.svg" alt="" />
              <img loading="lazy" src="Adobe.svg" alt="" />
              <img loading="lazy" src="Airbnb.svg" alt="" />
              <img loading="lazy" src="Amazon.svg" alt="" />
              <img loading="lazy" src="Meta.svg" alt="" />
              <img loading="lazy" src="Microsoft.svg" alt="" />
              <img loading="lazy" src="Bloomberg.svg" alt="" />
              <img loading="lazy" src="Netflix.svg" alt="" />
              <img loading="lazy" src="Spotify.svg" alt="" />
              <img loading="lazy" src="Tesla.svg" alt="" />
            </div>
            <div className="flex items-center gap-12 pr-12">
              <img loading="lazy" src="/Google.svg" alt="" />
              <img loading="lazy" src="Adobe.svg" alt="" />
              <img loading="lazy" src="Airbnb.svg" alt="" />
              <img loading="lazy" src="Amazon.svg" alt="" />
              <img loading="lazy" src="Meta.svg" alt="" />
              <img loading="lazy" src="Microsoft.svg" alt="" />
              <img loading="lazy" src="Bloomberg.svg" alt="" />
              <img loading="lazy" src="Netflix.svg" alt="" />
              <img loading="lazy" src="Spotify.svg" alt="" />
              <img loading="lazy" src="Tesla.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-transparent h-auto w-full flex flex-col items-center justify-between">
        <h1 className="text-[#0164FC] dark:text-blue-400 font-bold lg:text-7xl text-5xl py-20">
          Features
        </h1>

        {/* AI Resume Helper */}
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-40 gap-10 mb-10 text-center lg:text-left">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            <h4 className="text-[#009854] font-semibold flex items-center gap-2 text-xl lg:text-base">
              <RiArticleLine size={18} /> AI Resume Helper
            </h4>
            <h2 className="lg:text-4xl text-3xl font-bold text-[#009854]">
              Build a resume that gets noticed
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Use AI to instantly generate job-specific, ATS-friendly resumes
              that stand out.
            </p>
          </div>
          <div className="w-full lg:w-1/3">
            <img
              loading="lazy"
              className="w-full rounded-2xl"
              src="/AI_Resume.png"
              alt=""
            />
          </div>
        </div>

        {/* Job Tracker */}
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-40 gap-10 mb-10 text-center lg:text-left">
          <div className="w-full lg:w-1/3">
            <img
              loading="lazy"
              className="w-full rounded-2xl"
              src="/AI_Resume.png"
              alt=""
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            <h4 className="text-[#DD258F] font-semibold flex items-center gap-2 text-xl lg:text-base">
              <RiListCheck3 size={18} /> Job Tracker
            </h4>
            <h2 className="lg:text-4xl text-3xl font-bold text-[#DD258F]">
              Stay on top of your applications
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Track all your job applications in one place and follow up
              effectively.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Glow accents */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0164FC] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00B5D8] opacity-20 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-16">
            How It{" "}
            <span className="bg-gradient-to-r from-[#0164FC] to-[#00B5D8] text-transparent bg-clip-text">
              Works
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Build Your Profile",
                desc: "AI helps you craft a job-winning resume and portfolio in minutes.",
                icon: <RiArticleLine size={28} />,
                gradient: "from-[#0164FC] to-[#00B5D8]",
              },
              {
                title: "Apply & Track",
                desc: "Manage all your job applications in one clean, easy-to-use dashboard.",
                icon: <RiListCheck3 size={28} />,
                gradient: "from-[#DD258F] to-[#FF6CAB]",
              },
              {
                title: "Get Matched",
                desc: "We connect you with recruiters and companies that fit your skills.",
                icon: <RiRocketLine size={28} />,
                gradient: "from-[#009854] to-[#00DFA2]",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-10 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <div
                  className={`w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-r ${step.gradient} text-white text-2xl mb-6 shadow-md`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <div className="bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 ease-in-out overflow-x-hidden">
        <div className="scroll-horizontal space-x-4 flex overflow-x-auto pb-6">
          {[...reviews, ...reviews].map((review, idx) => (
            <div key={idx} className="flex-shrink-0">
              <Review {...review} />
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        {/* Glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0164FC] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00B5D8] opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-12">
            Why{" "}
            <span className="bg-gradient-to-r from-[#0164FC] to-[#00B5D8] text-transparent bg-clip-text">
              Choose Us
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "AI-Powered Tools",
                desc: "Resumes, cover letters, and job matches tailored just for you.",
                icon: <RiRobotLine size={26} />,
              },
              {
                title: "All-in-One Platform",
                desc: "Search, apply, track, and connect with recruiters seamlessly.",
                icon: <RiAppsLine size={26} />,
              },
              {
                title: "Proven Results",
                desc: "92% of users land interviews within 30 days of using our platform.",
                icon: <RiBarChartBoxLine size={26} />,
              },
              {
                title: "For Recruiters Too",
                desc: "Smart filters and matching make hiring faster and easier.",
                icon: <RiUserSearchLine size={26} />,
              },
              {
                title: "Seamless Experience",
                desc: "Dark mode ready, mobile-friendly, and lightning fast.",
                icon: <RiFlashlightLine size={26} />,
              },
              {
                title: "Global Community",
                desc: "100,000+ professionals trust us with their careers.",
                icon: <RiTeamLine size={26} />,
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-8 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 transition transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#0164FC] to-[#00B5D8] text-white text-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter Section */}
      <section className="relative py-28 text-center px-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-gray-900 dark:to-blue-950 transition-all duration-500">
        {/* Optional pattern or overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 40%, #0164FC 0%, transparent 40%)",
          }}
        ></div>

        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
            Right People,{" "}
            <span className="bg-gradient-to-r from-[#0164FC] to-[#00B5D8] text-transparent bg-clip-text">
              Not Just Resumes
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-8">
            Whether you’re hiring for one role or many, we help you post jobs
            and manage responses with zero noise.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="bg-white text-[#0164FC] font-bold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition cursor-pointer"
            >
              Get Started
            </Link>
            <Link
              to="/signup?role=recruiter"
              className="bg-[#0164FC] hover:bg-[#004fcb] transition text-white font-bold rounded-xl shadow-md text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3 cursor-pointer"
            >
              Hire Talent
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
