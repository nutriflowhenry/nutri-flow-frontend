'use client';
import React, { useState, useEffect } from 'react';
import { getDailyCalories } from '@/helpers/foodEntriesHelper';
import { ICaloriesData } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CaloriesCounterProps {
  token: string;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  refreshTrigger: number; 
}

const CaloriesCounter: React.FC<CaloriesCounterProps> = ({
  token,
  currentDate,
  setCurrentDate,
  refreshTrigger, 
}) => {
  const [calories, setCalories] = useState<ICaloriesData>({ consumed: 0, goal: 1500 });

  useEffect(() => {
    const fetchCalories = async () => {
      try {
        const data = await getDailyCalories(currentDate, token);
        if (data) {
          setCalories({ consumed: data.consumed, goal: data.goal });
        }
      } catch (error) {
        console.error('Failed to fetch calories data:', error);
      }
    };

    fetchCalories();
  }, [currentDate, token, refreshTrigger]); 

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate.toISOString());
  };

  const progress = Math.min((calories.consumed / calories.goal) * 100, 100);

  const formattedDate = new Date(currentDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="relative my-10 bg-gradient-to-br from-[#F2DFC5] to-[#CEB58D] p-6 rounded-[25px] shadow-[4px_4px_10px_rgba(0,0,0,0.1),_-4px_-4px_10px_rgba(255,255,255,0.5)] w-3/4 md:w-2/3">
      <div className="flex justify-center items-center space-x-4 text-gray-600">
        <button
          onClick={() => changeDate(-1)}
          aria-label="Previous day"
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>

        <span className="font-bold text-black text-lg">{formattedDate}</span>

        <button
          onClick={() => changeDate(1)}
          aria-label="Next day"
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-black">
          <span className="text-lg">{calories.consumed}/{calories.goal} kcal</span>
        </div>
        <div className="bg-[#FDF5EC] rounded-full drop-shadow-xl h-4 mt-2 relative overflow-hidden">
          <div
            className="bg-[#9BA783] h-4 rounded-full absolute top-0 left-0"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={calories.consumed}
            aria-valuemin={0}
            aria-valuemax={calories.goal}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CaloriesCounter;