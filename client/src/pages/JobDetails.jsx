import React from 'react'
import UserNavbar from '../components/UserNavbar'

const JobDetails = () => {
  return (
    <div className='w-full min-h-screen bg-[##F9F9F9] overflow-y-hidden'>
      <UserNavbar />
      <div className='w-full h-full px-12 py-8 flex flex-col gap-6'>
        <h2 className='text-4xl font-bold'>Job Details</h2>
        <div className=''>
            <div className='w-full h-52 bg-white rounded-xl shadow-md mb-4 p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex flex-col gap-4'>
                        <div>
                            <h2 className='text-2xl font-medium'>Chief Happiness Partners</h2>
                            <p className='text-md text-neutral-900'>Passion Infotech</p>
                        </div>
                        <div>
                            <div className='flex items-center gap-8'>
                                <h5 className='text-md font-medium text-neutral-700  border-r-[2px] border-neutral-200 pr-4'>15 - 22 years</h5>
                                <h5 className='text-md font-medium text-neutral-700  border-r-[2px] border-neutral-200 pr-4'>Not Disclosed</h5>
                                <h5 className='text-md font-medium text-neutral-700  border-r-[2px] border-neutral-200 pr-4'>Remote</h5>
                                <h5 className='text-md font-medium text-neutral-700'>Hiring office located in Pune</h5>
                            </div>
                        </div>
                    </div>
                    <div className='w-20 h-20 rounded-lg bg-gray-300 ring-2 ring-[#F2F2F2] overflow-hidden'>
                        <img className='h-full w-full object-cover content-center' src="/Recruiter.jpg" alt="" />
                    </div>
                </div>
                <div className='w-full h-[1.5px] bg-neutral-300 mb-4'></div>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <h5 className='text-md text-neutral-600 font-light'>Posted: <span className='text-black font-normal'>1 week ago</span></h5>
                        <h5 className='text-md text-neutral-600 font-light'>Openings: <span className='text-black font-normal'>1</span></h5>
                        <h5 className='text-md text-neutral-600 font-light'>Applicants: <span className='text-black font-normal'>100+</span></h5>
                    </div>
                    <div>
                        <button className='bg-blue-600 text-white font-medium py-2 px-4 rounded-lg'>Apply with AI</button>
                    </div>
                </div>
            </div>
            <div className='w-full min-h-44 bg-white rounded-xl shadow-md p-6'>
                <h3 className='text-xl font-medium mb-4'>Job description</h3>
                <div className='text-md text-neutral-700 flex flex-col gap-4'>
                    <h6>Role: Group Leader, Human Resources/Sr. Manager, Human Resources
Location: Bangalore

The Role: We are looking for a dynamic people leader who understands the - bigger picture- and can balance strategic vision and thought leadership with execution excellence. The incumbent will bring extraordinary focus and expertise in scaling a dynamic operation and organization focused on the customer-centricity, team growth and well-being and operational rigor.

The Group Leader- Human Resources leader will be responsible for managing a large, complex site/location. The incumbent will work with senior operations leaders, strategize business goals and execute key HR initiatives that impact . This is a business of rapid change, and the Company seeks the right leader, who is comfortable with change, strong in communication and focused on delivering HR services to our internal customers the employees. He/she must be someone who demonstrates tenacity, possesses exemplary character, is ethical in all matters, and who leads with commitment to excellence

. Key Responsibilities

• The role would involve complete generalist activities, HR initiatives, employee retention & employee engagement etc for the location.
• Provide strategic thinking and direction to the team and implement the Human Resource strategies effectively and efficiently.
• Provide vision, leadership, planning, and guidance for the development, implementation and management of an effective employee lifecycle.
• Foster and maintain positive relationships with Customer base, serving as an interface between internal (Human Resources) and the business operations leaders to ensure effective delivery of employee processes.
• Drive the continuing development of the team and the integration of HR functions.
• Work closely with the leadership team in the development and implementation of both short and long-term human resources strategies designed to drive business growth, and overall employee engagement.
• Partner closely with the senior leadership team to drive culture change for the location, aligning to the Concentrix cultural values.
• Leading the creation of a culture of open and proactive communications so that every employee has the necessary information needed to perform to their maximum potential. • Implement the company's employee engagement programs and employee engagement survey process.
• In collaboration with HR Centers of Excellence (CoE), manage employee compensation, benefits and reward programs to ensure consistency.
• Act as a mentor, coach, thought leader and functional expert to senior management. • Implement consistent strategy for HR management and development and selection of policy/practices, performance management and compensation, goal setting, diversity and inclusion, and employee relations.
• Manage and develop direct reporting staff.

Profile & Experience
• Candidates with HRBP experience in third party business process services companies preferred.
• Must be well-versed with HR generalist responsibilities.
• Experience leading teams in a fast moving, customer-centric, hands-on environment.
• Experience working with a global, matrix environment with multicultural teams.
• Proven ability to identify and independently solve complex problems through the implementation of systems based on industry best practices.</h6>
                    <div className='flex flex-col gap-1'>
                         <h6><span className='text-black font-semibold'>Level:</span> Remote</h6>
                        <h6><span className='text-black font-semibold'>Type:</span> Junior</h6>
                        <h6><span className='text-black font-semibold'>Department:</span> Human Resources</h6>
                        <h6><span className='text-black font-semibold'>Employment Type:</span> Full Time, Permanent</h6>
                    </div>
                   
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
