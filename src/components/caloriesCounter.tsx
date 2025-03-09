'use client'
import React, { useState, useEffect } from 'react';
import { getDailyCalories } from '@/helpers/foodEntriesHelper';
import { ICaloriesData } from '@/types';



const CaloriesCounter: React.FC<{ token: string }> = ({ token }) => {
  
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [calories, setCalories] = useState<ICaloriesData>({ consumed: 0, goal: 1500 });
  

  useEffect(() => {
    const fetchCalories = async () => {
      const data = await getDailyCalories(date, token);
      
      if (data) {
        setCalories({ consumed: data.consumed, goal: data.goal });
      }
    };

    fetchCalories();
  }, [date, token]);

  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString());
  };

  const progress = (calories.consumed / calories.goal) * 100;

  return (
    <div className="bg-gradient-to-b from-beige to-brown p-4 rounded-2xl shadow-lg">
      <div className="flex justify-center space-x-4 text-gray-600">
        <button onClick={() => changeDate(-1)}>◀️</button>
        <span className="font-bold text-black">{date}</span>
        <button onClick={() => changeDate(1)}>▶️</button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-black">
          <span>{calories.consumed}/{calories.goal} kcal</span>
        </div>
        <div className="bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CaloriesCounter;