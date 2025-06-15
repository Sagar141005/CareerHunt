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

  const firstName = user.name.split(" ")[0];
  const capitalisedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const navigate = useNavigate();

    useEffect(() => {
        if(!loading && !user) {
            navigate('/login');
        }
    }, [ user, loading, navigate ]);

    useEffect(() => {
      if (user && user.role !== 'recruiter') {
        navigate('/dashboard');
        console.error("Not Authenticated");
      }
    }, [user, navigate]);

    if(loading) {
      return <p>Loading...</p>
  }

  return (
    <div className='bg-[#F2F2F2] flex gap-6'>
      <RecruiterPannel />
      <div>
        <div className='flex items-center justify-between pr-8 py-6'>
          <h2 className='text-2xl font-bold'>Dashboard</h2>
          <CurrentDate />
        </div>
        <div className='flex gap-4'>
          <div>
            <div className='flex items-center gap-4 mb-4'>
              <div className='bg-white w-80 h-40 rounded-xl shadow-lg shadow-neutral-300 flex items-center px-4'>
                <div className='flex flex-col w-40'>
                  <h5 className='text-neutral-500 text-xs font-semibold mb-2'>APPLICATIONS</h5>
                  <h3 className='text-4xl font-semibold'>{formatCount(all.currentCount)}</h3>
                </div>
                <div className='flex-grow'></div>
                <div className='w-1/2 -mr-6'>
                  <RadialChart growth={all.growth} label="" size="52%" color='#3B82F6' />
                </div>
              </div>
              <div className='bg-white w-80 h-40 rounded-xl shadow-lg shadow-neutral-300 flex items-center px-4'>
              <div className='flex flex-col w-40'>
                  <h5 className='text-neutral-500 text-xs font-semibold mb-2'>SHORTLISTED</h5>
                  <h3 className='text-4xl font-semibold'>{formatCount(shortlist.currentCount)}</h3>
                </div>
                <div className='flex-grow'></div>
                <div className='w-1/2 -mr-6'>
                  <RadialChart growth={shortlist.growth} label="" size="52%" color='#22C55E' />
                </div>
              </div>
            </div>
            <div className='bg-white w-full rounded-xl h-120 shadow-lg shadow-neutral-300'>
              <SplineChart
                data={[10, 30, 45, 25, 60, 80, 55]}
                categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                color="#22C55E"
                />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
          <div className='bg-white w-80 h-40 rounded-xl shadow-lg shadow-neutral-300 flex items-center px-4'>
          <div className='flex flex-col w-40'>
                  <h5 className='text-neutral-500 text-xs font-semibold mb-2'>ON-HOLD</h5>
                  <h3 className='text-4xl font-semibold'>{formatCount(onHold.currentCount)}</h3>
                </div>
                <div className='flex-grow'></div>
                <div className='w-1/2 -mr-6'>
                  <RadialChart growth={onHold.growth} label="" size="52%" color='#FACC15' />
                </div>
              </div>
          <div className='bg-white w-80 h-50 rounded-xl shadow-lg shadow-neutral-300'>
            <HorizontalBar />
          </div>
          <div className='bg-white w-80 h-66 rounded-xl shadow-lg shadow-neutral-300 p-4 overflow-y-auto'>
            <h3 className='text-lg font-bold text-gray-800 mb-1'>New Applicants</h3>
            <Applicant />
          </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='bg-white w-42 h-70 mr-6 rounded-xl shadow-lg shadow-neutral-300 p-4'>
              <h3 className='text-xl font-bold mb-4'>Profile</h3>
              <div className='flex flex-col items-center gap-4'>
                <img className='h-30 w-30 object-cover content-center rounded-full' src={user.profilePic || '/Recruiter.png'} alt="" />
                <div className='flex flex-col items-center'>
                  <h3 className='text-lg font-bold text-neutral-950 max-w-[120px] truncate capitalize'>{user.name}</h3>
                  <h3  className='text-md font-semibold text-neutral-700'>{user.company?.name}</h3>
                  <h4 className='text-xs font-medium text-neutral-500 capitalize'>{user.role}</h4>
                </div>
              </div>
            </div>
            <div className='bg-white w-42 h-90 mr-6 rounded-xl shadow-lg shadow-neutral-300'>
            <h3 className='text-xl font-bold p-4'>Hired</h3>
              <div className='flex flex-col justify-between items-center'>
                <img className='h-40 -mt-4' src="./image.png" alt="" />
                <RadialChart growth={hired.growth} label="" size="52%" color='#FB923C' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard
