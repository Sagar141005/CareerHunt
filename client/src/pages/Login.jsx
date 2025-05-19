import React from 'react'

const Login = () => {
  return (
    <div className='w-full h-screen flex'>
      <div className='flex flex-col items-center p-auto flex-1 bg-white'>
        <div className='m-auto flex flex-col items-center gap-6'>
            <h1 className='text-shadow-2xs text-3xl font-extrabold'>LOGIN</h1>
                <form className='flex flex-col gap-4'>
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor="email">Email<span className='text-red-600'>*</span></label>
                        <input 
                        className='bg-gradient-to-r from-blue-200 to-blue-400 px-8 py-2 rounded-lg text-black' 
                        type="text" 
                        placeholder='Email'
                        required/>
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor="password">Password<span className='text-red-600'>*</span></label>
                        <input 
                        className='bg-gradient-to-r from-blue-200 to-blue-400 px-8 py-2 rounded-lg text-black' 
                        type="password" 
                        placeholder='Password'
                        required/>
                    </div>
                    <button className='bg-gradient-to-br from-blue-300 to-blue-700 p-4 rounded-2xl text-white font-bold text-lg mt-4 shadow-md hover:to-blue-800 transition duration-300 hover:shadow-xl'>Sign Up</button>
                </form>
                <p>New user? <a href="#">Create an Account</a></p>
            </div>
      </div>
      <div className='flex-1'>
            <img className='w-full h-full object-cover' src="/signup.png" alt="" />
      </div>
    </div>
  )
}

export default Login
