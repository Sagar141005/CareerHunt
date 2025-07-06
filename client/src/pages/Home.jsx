import React from 'react'
import HomeNavbar from '../components/UserNavbar'
import { RiArticleLine, RiListCheck3 } from '@remixicon/react'
import Review from '../components/Review'
import { reviews } from '../data/reviews'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <section className="relative h-[90vh] lg:min-h-screen sm:h-1/3 flex flex-col items-center justify-center text-center px-6">
        <div className="absolute top-6 right-6 z-30 flex gap-4">
          <Link to="/login" className="bg-transparent border border-[#0164FC] text-[#0164FC] hover:bg-blue-50 transition font-semibold px-5 py-2 rounded-lg">
            Log in
          </Link>
          <Link to="/signup" className="bg-[#0164FC] hover:bg-[#004fcb] transition text-white font-semibold px-5 py-2 rounded-lg shadow-sm">
            Register
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#b7c9ec] via-white to-[#F8F9FA] z-0" />
          <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
            maskImage:
              'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}></div>
          <div className='z-20'>
            <p className="text-[#0164FC] font-semibold mb-3 tracking-wide uppercase text-center text-sm sm:text-base md:text-lg">
              Trusted by over 100,000 professionals
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              Cut the Confusion. <br />
              <span className="bg-gradient-to-r from-[#0164FC] to-[#00B5D8] text-transparent bg-clip-text">
                Claim Your Career.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              AI-powered tools for candidates and recruiters. Smarter job search starts here.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap justify-center">
              <Link
                to="/signup"
                className="bg-[#0164FC] hover:bg-[#004fcb] transition text-white font-bold rounded-xl shadow-md text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3">
                I’m a Job Seeker
              </Link>
              <Link
                to="/signup?role=recruiter"
                className="bg-white border border-[#0164FC] text-[#0164FC] hover:bg-blue-50 transition font-bold rounded-xl text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3">
                I’m a Recruiter
              </Link>
            </div>

        </div>

        {/* Social proof quote */}
        <div className="mt-12 text-center z-20">
          <div className="flex justify-center -space-x-3 mb-2">
            {[
              "https://images.unsplash.com/photo-1560250097-0b93528c311a",
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
              "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50",
              "https://plus.unsplash.com/premium_photo-1670884442927-e647436e12ff",
            ].map((src, i) => (
              <img
                key={i}
                src={`${src}?w=80&q=80`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                alt="user"
              />
            ))}
          </div>
          <p className="text-sm text-gray-700">
            “I finally got noticed. Recruiters from Google and Amazon reached out within days.”
          </p>
        </div>
      </section>
      <div className='bg-transparent lg:h-48 sm:h-64 w-full flex flex-col items-center text-center px-4 sm:px-6 md:px-12">'>
        <div>
          <h2 className='text-[#1A1C1F] font-bold lg:text-3xl sm:text-2xl mt-12'>Trusted by job seekers who've landed at top companies</h2>
          <h4 className='text-[#1A1C1F] lg:text-md sm:text-lg'>Our users have secured positions at industry-leading companies such as</h4>
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
      <div className='bg-gradient-to-b from-[#F8F9FA] via-white to-[#F8F9FA] h-auto w-full flex flex-col items-center justify-between'>

          <h1 className='text-[#0164FC] font-bold lg:text-7xl text-5xl py-20'>Features</h1>
          <div className='flex flex-col lg:flex-row items-center justify-between px-6 lg:px-40 gap-10 mb-10 text-center lg:text-left'>
            <div className='w-full lg:w-1/2 flex flex-col items-center lg:items-start'>
            <h4 className="text-[#009854] font-semibold flex items-center gap-2 text-xl lg:text-base">
              <RiArticleLine size={18} /> AI Resume Helper
            </h4>
              <h2 className="lg:text-4xl text-3xl font-bold text-[#009854]">Build a resume that gets noticed</h2>
              <p className="text-lg text-gray-700">
                Use AI to instantly generate job-specific, ATS-friendly resumes that stand out.
              </p>
            </div>
            <div className='w-full lg:w-1/3'>
              <img className='w-full rounded-2xl' src="/AI_Resume.png" alt="" />
            </div>
          </div>
          <div className='flex flex-col lg:flex-row items-center justify-between px-6 lg:px-40 gap-10 mb-10 text-center lg:text-left'>
            <div className='w-full lg:w-1/2 flex flex-col items-center lg:items-start'>
              <h4 className="text-[#DD258F] font-semibold flex items-center gap-2 text-xl lg:text-base">
                <RiListCheck3 size={18} /> Job Tracker
              </h4>
              <h2 className="lg:text-4xl text-3xl font-bold text-[#DD258F]">Stay on top of your applications</h2>
              <p className="text-lg text-gray-700">
              Track all your job applications in one place and follow up effectively.
              </p>
            </div>
            <div className='w-full lg:w-1/3'>
              <img className='w-full rounded-2xl' src="/AI_Resume.png" alt="" />
            </div>
          </div>
      </div>
      <section className="py-24 bg-gradient-to-b from-[#F8F9FA] to-[#F3F4F6] text-center px-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">Right People, Not Just Resumes</h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-600 mb-8">
          Whether you’re hiring for one role or many, we help you post jobs and manage responses with zero noise.
        </p>
        <Link to="/recruiter/dashboard" className="bg-black text-white px-6 py-4 rounded-xl font-bold shadow-md hover:scale-105 transition">
          Post a Job
        </Link>
      </section>
      <div className="bg-gradient-to-b from-[#F3F4F6] via-white to-gray-100 transition-all duration-1000 ease-in-out overflow-x-hidden">
        <div className="scroll-horizontal space-x-4 flex overflow-x-auto pb-6">
          {[...reviews, ...reviews].map((review, idx) => (
            <div key={idx} className="flex-shrink-0">
              <Review {...review} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
