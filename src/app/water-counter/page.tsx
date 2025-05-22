
import React from 'react'
import WaterCounterView from '@/views/WaterCounterView'

const page = () => {
    const today = new Date().toISOString().slice(0, 10);
    return (
        <WaterCounterView currentDate={today}/>
    )
}

export default page

