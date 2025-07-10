import React, { useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext'
import RecruiterPannel from './RecruiterPannel'
import CurrentDate from './CurrentDate'
import { useNavigate } from 'react-router-dom'
import useMonthlyGrowth from "../hooks/useMonthlyGrowth";
import Loader from './Loader';
import { MoonLoader } from 'react-spinners';

const RadialChart = lazy(() => import('./RadialChart'));
const SplineChart = lazy(() => import('./SplineChart'));
const HorizontalBar = lazy(() => import('./HorizontalBar'));
const Applicant = lazy(() => import('./Applicant'));

const formatCount = (count) => {
  if (!count) return 0;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count;
};

const RecruiterDashboard = () => {
  const { user, loading } = useAuth();

  const all = useMonthlyGrowth("");
  const shortlist = useMonthlyGrowth("Shortlisted");
  const onHold = useMonthlyGrowth("On-Hold");
  const hired = useMonthlyGrowth("Hired");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && user.role !== 'recruiter') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-[#F2F2F2] dark:from-gray-900 dark:to-gray-800 flex h-screen overflow-hidden flex-col sm:flex-row">
      <RecruiterPannel />
      <div className="flex flex-col flex-grow p-6 gap-6 overflow-auto">
        <div className="flex items-center justify-between pr-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <CurrentDate className="text-gray-800 dark:text-gray-300" />
        </div>

        <div className="flex gap-4 flex-grow flex-col sm:flex-row">
          <div className="flex flex-col h-full gap-4 w-full sm:w-auto">
            {/* Cards Section – fixed height */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white dark:bg-gray-800 w-full sm:w-80 h-40 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black flex items-center px-4">
                <div className="flex flex-col w-40">
                  <h5 className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-2">APPLICATIONS</h5>
                  <h3 className="text-4xl font-semibold text-gray-900 dark:text-white">{formatCount(all.currentCount)}</h3>
                </div>
                <div className="flex-grow"></div>
                <div className="w-1/2 -mr-6">
                  <Suspense fallback={<Loader />}>
                    <RadialChart growth={all.percentage} label="" size="52%" color="#3B82F6" />
                  </Suspense>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 w-full sm:w-80 h-40 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black flex items-center px-4">
                <div className="flex flex-col w-40">
                  <h5 className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-2">SHORTLISTED</h5>
                  <h3 className="text-4xl font-semibold text-gray-900 dark:text-white">{formatCount(shortlist.currentCount)}</h3>
                </div>
                <div className="flex-grow"></div>
                <div className="w-1/2 -mr-6">
                  <Suspense fallback={<Loader />}>
                    <RadialChart growth={shortlist.percentage} label="" size="52%" color="#22C55E" />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Spline Chart – takes remaining height */}
            <div className="flex-grow overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black min-h-[500px] mt-4 sm:mt-0">
              <Suspense fallback={<Loader />}>
                <SplineChart
                data={[10, 30, 45, 25, 60, 80, 55]}
                categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                color="#22C55E"
                />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full sm:w-80 h-[calc(100vh-100px)] flex-shrink-0 mt-4 sm:mt-0">
            <div className="bg-white dark:bg-gray-800 w-full h-40 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black flex items-center px-4">
              <div className="flex flex-col w-40">
                <h5 className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-2">ON-HOLD</h5>
                <h3 className="text-4xl font-semibold text-gray-900 dark:text-white">{formatCount(onHold.currentCount)}</h3>
              </div>
              <div className="flex-grow"></div>
              <div className="w-1/2 -mr-6">
                <Suspense fallback={
                  <div className="flex justify-center items-center py-6">
                    <MoonLoader color="#3B82F6" size={12} />
                  </div>}>
                  <RadialChart growth={onHold.percentage} label="" size="52%" color="#FACC15" />
                </Suspense>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black min-h-[200px] overflow-hidden">
              <Suspense fallback={<Loader />}>
                <HorizontalBar />
              </Suspense> 
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black flex flex-col flex-grow min-h-0 p-4 overflow-hidden">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">New Applicants</h3>
              <div className="flex-grow overflow-y-auto min-h-0 pr-1">
                <Suspense fallback={
                  <div className="flex justify-center items-center py-6">
                    <MoonLoader color="#3B82F6" size={12} />
                  </div>}>
                  <Applicant />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between mr-0 sm:mr-6 w-full sm:w-[160px] gap-4 mt-4 sm:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black p-4 flex-1 min-h-[260px]">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h3>
              <div className="flex flex-col items-center justify-around h-full pb-10">
                <img
                  className="h-24 w-24 object-cover rounded-full"
                  src={user.profilePic || '/Recruiter.jpg'}
                  alt="user-profile-pic"
                />
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white max-w-[120px] truncate capitalize">{user.name}</h3>
                  <h3 className="text-md font-semibold text-neutral-700 dark:text-gray-300">{user.company?.name}</h3>
                  <h4 className="text-xs font-medium text-neutral-500 dark:text-gray-400 capitalize">{user.role}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-neutral-300 dark:shadow-black p-4 flex-1 min-h-[260px] flex flex-col justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hired</h3>
              <img className="h-32 -mt-2" src="./image.png" alt="" />
              <Suspense fallback={<Loader />}>
                <RadialChart growth={hired.percentage} label="" size="52%" color="#FB923C" />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
