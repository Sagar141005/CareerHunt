import React from 'react'
import { MoonLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-6">
        <MoonLoader color="#3B82F6" size={12} />
    </div>
  )
}

export default Loader
