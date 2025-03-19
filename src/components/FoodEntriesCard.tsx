'use client';

import React from 'react';
import { IFoodTracker } from '@/types';

const FoodEntriesCard: React.FC<IFoodTracker> = ({
  id,
  name,
  calories,
  description,
  isActive,
  imageUrl, // Ahora está definido en la interfaz
}) => {
  if (!isActive) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 w-[156px] h-[229px] flex flex-col items-center">
      <img
        src={imageUrl || "https://img.freepik.com/foto-gratis/vista-superior-plato-vacio-cubiertos_23-2148496913.jpg?size=626&ext=jpg"}
        alt={name}
        className="w-full h-[120px] object-cover rounded-xl"
      />
      <h2 className="text-sm font-sora text-[#242424] font-semibold mt-2 text-center">
        {name}
      </h2>
      <p className="text-[#a2a2a2] font-sora font-light text-xs text-center px-2">
        {description || 'No description'}
      </p>
      <p className="text-md text-[#050505] font-sora font-semibold mt-auto">
        {calories}kcal
      </p>
    </div>
  );
};

export default FoodEntriesCard;