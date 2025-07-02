import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import RecruiterPannel from './RecruiterPannel'
import RadialChart from './RadialChart'
import SplineChart from './SplineChart'
import HorizontalBar from './HorizontalBar'
import Applicant from './Applicant'
import CurrentDate from './CurrentDate'
import { useNavigate } from 'react-router-dom'
import useMonthlyGrowth from "../hooks/useMonthlyGrowth";

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
    <div className="bg-[#F2F2F2] flex h-screen overflow-hidden">
      <RecruiterPannel />
      <div className="flex flex-col flex-grow p-6 gap-6">
        <div className="flex items-center justify-between pr-4">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <CurrentDate />
        </div>

        <div className="flex gap-4 flex-grow">
        <div className="flex flex-col h-full gap-4">
  {/* Cards Section – fixed height */}
  <div className="flex items-center gap-4">
    <Card title="APPLICATIONS" value={formatCount(all.currentCount)} color="#3B82F6">
      <RadialChart growth={all.growth} label="" size="52%" color="#3B82F6" />
    </Card>
    <Card title="SHORTLISTED" value={formatCount(shortlist.currentCount)} color="#22C55E">
      <RadialChart growth={shortlist.growth} label="" size="52%" color="#22C55E" />
    </Card>
  </div>

  {/* Spline Chart – takes remaining height */}
  <div className="flex-grow overflow-hidden bg-white rounded-xl shadow-lg shadow-neutral-300 min-h-[500px]">
    <SplineChart
      data={[10, 30, 45, 25, 60, 80, 55]}
      categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      color="#22C55E"
    />
  </div>
</div>



          <div className="flex flex-col gap-4 w-80 h-[calc(100vh-100px)] flex-shrink-0">
            <Card title="ON-HOLD" value={formatCount(onHold.currentCount)} color="#FACC15">
              <RadialChart growth={onHold.growth} label="" size="52%" color="#FACC15" />
            </Card>

            <div className="bg-white rounded-xl shadow-lg shadow-neutral-300 min-h-[200px] overflow-hidden">
              <HorizontalBar />
            </div>

            <div className="bg-white rounded-xl shadow-lg shadow-neutral-300 flex flex-col flex-grow min-h-0 p-4 overflow-hidden">
              <h3 className="text-lg font-bold text-gray-800 mb-1">New Applicants</h3>
              <div className="flex-grow overflow-y-auto min-h-0 pr-1">
                <Applicant />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between mr-6 w-[160px] gap-4">
            <div className="bg-white rounded-xl shadow-lg shadow-neutral-300 p-4 flex-1 min-h-[260px]">
              <h3 className="text-xl font-bold mb-4">Profile</h3>
              <div className="flex flex-col items-center justify-around h-full pb-10">
                <img
                  className="h-24 w-24 object-cover rounded-full"
                  src={user.profilePic || '/Recruiter.png'}
                  alt="user-profile-pic"
                />
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-bold text-neutral-950 max-w-[120px] truncate capitalize">{user.name}</h3>
                  <h3 className="text-md font-semibold text-neutral-700">{user.company?.name}</h3>
                  <h4 className="text-xs font-medium text-neutral-500 capitalize">{user.role}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg shadow-neutral-300 p-4 flex-1 min-h-[260px] flex flex-col justify-between items-center">
              <h3 className="text-xl font-bold">Hired</h3>
              <img className="h-32 -mt-2" src="./image.png" alt="" />
              <RadialChart growth={hired.growth} label="" size="52%" color="#FB923C" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, children, color }) => (
  <div className="bg-white w-80 h-40 rounded-xl shadow-lg shadow-neutral-300 flex items-center px-4">
    <div className="flex flex-col w-40">
      <h5 className="text-neutral-500 text-xs font-semibold mb-2">{title}</h5>
      <h3 className="text-4xl font-semibold">{value}</h3>
    </div>
    <div className="flex-grow"></div>
    <div className="w-1/2 -mr-6">
      {children}
    </div>
  </div>
);

export default RecruiterDashboard;
