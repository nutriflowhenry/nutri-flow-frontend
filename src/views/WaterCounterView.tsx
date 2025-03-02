
'use client';

import React from 'react'
import { useState, useEffect } from 'react';

const WaterCounterView=()=> {
    const DAILY_GOAL = 2000; 
    const INCREMENT = 50; 
    const DECREMENT =50

    
    const [waterIntake, setWaterIntake] = useState(0);


    useEffect(() => {
    const savedIntake = localStorage.getItem('waterIntake');
    const savedDate = localStorage.getItem('lastDrinkDate');
    const today = new Date().toDateString();

    if (savedIntake && savedDate === today) {
        setWaterIntake(parseInt(savedIntake, 10));
    } else {
        localStorage.setItem('waterIntake', '0');
        localStorage.setItem('lastDrinkDate', today);
    }
    }, []);

    const addWater = () => {
    const newIntake = waterIntake + INCREMENT;
    setWaterIntake(newIntake);
    localStorage.setItem('waterIntake', newIntake.toString());
    localStorage.setItem('lastDrinkDate', new Date().toDateString());
    };

    const subtractWater=()=>{
        const newIntake =waterIntake -DECREMENT

        if(newIntake<0){
            alert("El valor consumido de agua no puede ser menor a 0")
            return;
        }
        setWaterIntake(newIntake);

        localStorage.setItem("waterIntake",newIntake.toString())
        localStorage.setItem("lastDrinkDate",new Date().toDateString())
    }

    return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold">Contador de Agua</h2>
        <p className="text-sm text-gray-400">Meta diaria: 2L (2000ml)</p>

        <div className="relative w-full bg-gray-700 h-6 rounded-full mt-4">
        <div
            className="bg-white-500 h-6 rounded-full"
            style={{ width: `${(waterIntake / DAILY_GOAL) * 100}%` }}
        ></div>
        </div>

        <p className="mt-2 text-lg">{waterIntake} ml</p>
        <button onClick={subtractWater}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
            Restar 50ml
        </button>
        <button
        onClick={addWater}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
        Agregar 50ml
        </button>
    </div>
    );
}

export default WaterCounterView
