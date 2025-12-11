import React, { useEffect, lazy, Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import RecruiterPannel from "./RecruiterPannel";
import CurrentDate from "./CurrentDate";
import { useNavigate } from "react-router-dom";
import useMonthlyGrowth from "../../hooks/useMonthlyGrowth";
import { ClipLoader } from "react-spinners";
import {
  RiBuildingLine,
  RiUser3Line,
  RiArrowRightUpLine,
  RiTimeLine,
  RiPencilRuler2Line,
  RiArrowRightLine,
} from "@remixicon/react";

const RadialChart = lazy(() => import("./RadialChart"));
const SplineChart = lazy(() => import("./SplineChart"));
const HorizontalBar = lazy(() => import("./HorizontalBar"));
const Applicant = lazy(() => import("./Applicant"));

const formatCount = (count) => {
  if (!count) return 0;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count;
};

const KPICard = ({ title, count, growth, color }) => (
  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
    <div className="z-10 relative">
      <h5 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">
        {title}
      </h5>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {formatCount(count)}
        </h3>
      </div>
      <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
        <span
          className={`font-semibold ${
            growth >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {growth > 0 ? "+" : ""}
          {growth}%
        </span>
        <span>vs last month</span>
      </p>
    </div>

    <div className="relative w-16 h-16 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
        }
      >
        <RadialChart growth={growth} color={color} size="60%" />
      </Suspense>
    </div>
  </div>
);

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const all = useMonthlyGrowth("");
  const shortlist = useMonthlyGrowth("Shortlisted");
  const onHold = useMonthlyGrowth("On-Hold");
  const hired = useMonthlyGrowth("Hired");

  useEffect(() => {
    if (!user) navigate("/login");
    if (user && user.role !== "recruiter") navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden flex-col md:flex-row">
      <RecruiterPannel />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
                Performance metrics for{" "}
                <span className="font-bold text-neutral-900 dark:text-white">
                  {user.company?.name || "your company"}
                </span>
                .
              </p>
            </div>
            <div className="hidden sm:block">
              <CurrentDate className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:text-sm" />
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <KPICard
              title="Total Applications"
              count={all.currentCount}
              growth={all.percentage}
              color="#0164FC"
            />
            <KPICard
              title="Shortlisted"
              count={shortlist.currentCount}
              growth={shortlist.percentage}
              color="#10B981"
            />
            <KPICard
              title="On Hold"
              count={onHold.currentCount}
              growth={onHold.percentage}
              color="#F59E0B"
            />
            <KPICard
              title="Hired"
              count={hired.currentCount}
              growth={hired.percentage}
              color="#F97316"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden min-h-80">
              <Suspense
                fallback={
                  <div className="h-full w-full flex items-center justify-center">
                    <ClipLoader size={20} color="#0164FC" />
                  </div>
                }
              >
                <SplineChart />
              </Suspense>
            </div>

            <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-800 overflow-hidden flex flex-col min-h-80">
              <div className="h-32 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
                >
                  <RiPencilRuler2Line size={16} />
                </button>
              </div>

              <div className="px-8 pb-8 flex-1 flex flex-col items-center -mt-12">
                <div className="w-24 h-24 rounded-full rotate-3 bg-white p-1.5 shadow-lg mb-4">
                  <img
                    className="w-full h-full object-cover rounded-full bg-neutral-100"
                    src={
                      user.profilePic ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=0164FC&color=fff`
                    }
                    alt={user.name}
                  />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white capitalize truncate mt-2">
                  {user.name}
                </h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-6 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full flex items-center gap-2">
                  <RiBuildingLine size={14} />
                  {user.company?.name || "Hiring Manager"}
                </p>

                <div className="w-full mt-auto space-y-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 transition-all duration-200"
                  >
                    <div className="text-sm font-semibold flex items-center gap-3 text-neutral-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                      <RiUser3Line size={18} />
                      <span className="text-neutral-900 dark:text-white">
                        My Profile
                      </span>
                    </div>
                    <RiArrowRightLine
                      size={18}
                      className="text-neutral-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>

                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="w-full group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 transition-all duration-200"
                  >
                    <div className="text-sm font-semibold flex items-center gap-3 text-neutral-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                      <RiBuildingLine size={18} />
                      <span className="text-neutral-900 dark:text-white">
                        Company Details
                      </span>
                    </div>
                    <RiArrowRightLine
                      size={18}
                      className="text-neutral-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col h-80">
              <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <RiTimeLine
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />{" "}
                  Recent Candidates
                </h3>
                <button
                  onClick={() => navigate("/applications")}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View All <RiArrowRightUpLine size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                <Suspense
                  fallback={
                    <div className="p-4 text-center text-neutral-400">
                      Loading candidates...
                    </div>
                  }
                >
                  <Applicant />
                </Suspense>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6 flex flex-col h-80">
              <Suspense
                fallback={
                  <div className="h-full w-full bg-neutral-100 animate-pulse rounded-xl" />
                }
              >
                <HorizontalBar />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
