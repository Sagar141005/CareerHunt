import React from 'react'

const CurrentDate = () => {

    const getCurrentDate = () => {
        const now = new Date();
        const day = now.getDate();
        const year = now.getFullYear();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      
        const month = months[now.getMonth()];
        const weekday = weekdays[now.getDay()];
        
        return `${day} ${month} ${year}, ${weekday}`;
    }

  return (
    <div>
      <h3 className='text-md text-neutral-600 font-medium mr-8'>{getCurrentDate()}</h3>
    </div>
  )
}

export default CurrentDate
