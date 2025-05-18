import React from 'react'
import HomeNavbar from '../components/HomeNavbar'
import { RiArticleLine, RiListCheck3 } from '@remixicon/react'
import Review from '../components/Review'
import { reviews } from '../data/reviews'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <HomeNavbar />
      <div className='bg-[#F8F9FA] h-screen w-full flex flex-col items-center text-center justify-around'>
        <div>
            <p className='text-[#0164FC] font-semibold text-md'>TRUSTED BY OVER 100K JOB SEEKERS!</p>
            <h1 className='text-[#1A1C1F] font-bold text-7xl'>Cut the Confusion. </h1>
            <h1 className='text-[#1A1C1F] font-bold text-7xl mb-4'>Claim Your <span className='text-[#0164FC]'>Career.</span></h1>
            <button className='bg-[#0164FC] text-white font-bold p-4 px-6 rounded-xl'>SIGN UP FOR FREE</button>
        </div>
        <div className='flex flex-col items-center'>
            <div className='flex mb-2'>
            <img className='w-12 h-12 rounded-full overflow-hidden flex items-center -ml-2 justify-center' src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            <img className='w-12 h-12 rounded-full overflow-hidden flex items-center -ml-2 justify-center' src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            <img className='w-12 h-12 rounded-full overflow-hidden flex items-center -ml-2 justify-center' src="https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?q=80&w=2968&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            <img className='w-12 h-12 rounded-full overflow-hidden flex items-center -ml-2 justify-center' src="https://plus.unsplash.com/premium_photo-1670884442927-e647436e12ff?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </div>
            <p className='text-[#1A1C1F] text-md'>"I finally got noticed. Recruiters from Google and Amazon </p>
            <p className='text-[#1A1C1F] text-md'>reached out within days!!"</p>
        </div>
      </div>
      <div className='bg-[#F8F9FA] h-48 w-full flex flex-col items-center text-center'>
        <div>
          <h2 className='text-[#1A1C1F] font-bold text-2xl mt-12'>Trusted by job seekers who've landed at top companies</h2>
          <h4 className='text-[#1A1C1F] font-lg'>Our users have secured positions at industry-leading companies such as</h4>
        </div>
        <div className='overflow-hidden w-full mt-8'>
          <div className='scroll-horizontal'>
            <div className='flex items-center gap-12 pr-12'>
              <img src="/Google.svg" alt="" />
              <img src="Adobe.svg" alt="" />
              <img src="Airbnb.svg" alt="" />
              <img src="Amazon.svg" alt="" />
              <img src="Meta.svg" alt="" />
              <img src="Microsoft.svg" alt="" />
              <img src="Bloomberg.svg" alt="" />
              <img src="Netflix.svg" alt="" />
              <img src="Spotify.svg" alt="" />
              <img src="Tesla.svg" alt="" />
            </div>
            <div className='flex items-center gap-12 pr-12'>
              <img src="/Google.svg" alt="" />
              <img src="Adobe.svg" alt="" />
              <img src="Airbnb.svg" alt="" />
              <img src="Amazon.svg" alt="" />
              <img src="Meta.svg" alt="" />
              <img src="Microsoft.svg" alt="" />
              <img src="Bloomberg.svg" alt="" />
              <img src="Netflix.svg" alt="" />
              <img src="Spotify.svg" alt="" />
              <img src="Tesla.svg" alt="" />
            </div>
            
            </div>
        </div>
      </div>
      <div className='bg-[#F8F9FA] h-auto w-full flex flex-col items-center justify-between'>
          <h1 className='text-[#0164FC] font-bold text-7xl py-20'>Features</h1>
          <div className='flex items-center justify-between mx-40 mb-30'>
            <div className='flex w-1/2 flex-col items-start'>
              <h4 className='font-semibold text-md flex items-center gap-1'><RiArticleLine size={15} color='#009854' /> AI RESUME HELPER</h4>
              <h2 className='text-[#009854] font-bold text-4xl'>Instantly build a job-ready resume with AI</h2>
              <h3 className='text-xl font-light'>Use AI to make your resume ATS-friendly, boost your score, and add job-specific keywords in just a few clicks.</h3>
            </div>
            <div className='w-1/3'>
              <img className='w-full rounded-2xl' src="/AI_Resume.png" alt="" />
            </div>
          </div>
          <div className='flex items-center justify-between mx-40 mb-20'>
            <div className='w-1/3'>
              <img className='w-full rounded-2xl' src="/Job_Tracker.png" alt="" />
            </div>
            <div className='flex w-1/2 flex-col items-start'>
              <h4 className='font-semibold text-md flex items-center gap-1'><RiListCheck3 size={15} color='#DD258F' /> JOB TRACKER</h4>
              <h2 className='text-[#DD258F] font-bold text-4xl'>Stay organized and track every application</h2>
              <h3 className='text-xl font-light'>Keep all your job applications in one place, monitor progress, and streamline your search from start to finish.</h3>
            </div>
          </div>
      </div>
      <div className='bg-[#F8F9FA] h-72 w-full flex flex-col items-center text-center justify-around'>
        <div>
          <h1 className='text-[#1A1C1F] font-extrabold text-6xl pb-4'>Right People, Not Just Resumes</h1>
          <p className='text-[#1A1C1F] text-lg w-1/2 mx-auto'>Whether you're hiring for one role or many, we make it easy to post jobs and manage responses—all in one place. Reach people who are actively looking, without the noise of traditional job boards.</p>
        </div>
        <button className='bg-black text-white font-bold p-4 px-6 rounded-xl'>Post a Job</button>
      </div>
      <div className='bg-[#F8F9FA] h-96 overflow-x-hidden w-full p-8 py-12'>
        <div className='scroll-horizontal space-x-4'>
          {[...reviews, ...reviews].map((review, idx) => (
            <div key={idx} className='flex-shrink-0'>
              <Review {...review} />
            </div>
          ))
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
