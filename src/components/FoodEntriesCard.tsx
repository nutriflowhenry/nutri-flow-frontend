'use client';

import React, { useState } from 'react';
import { IFoodTracker } from '@/types';

const FoodEntriesCard: React.FC<IFoodTracker> = ({
  id,
  name,
  calories,
  description,
  isActive,
  image, // Usar el campo image
}) => {
  const [imageError, setImageError] = useState(false); // Estado para manejar errores de carga de imagen

  if (!isActive) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 w-[156px] h-[229px] flex flex-col items-center">
      {/* Imagen de la comida */}
      <div className="w-full h-[120px] rounded-xl overflow-hidden">
        <img
          src={
            image && !imageError
              ? image
              : "https://img.freepik.com/foto-gratis/vista-superior-plato-vacio-cubiertos_23-2148496913.jpg?size=626&ext=jpg"
          }
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)} // Manejar errores de carga de imagen
        />
      </div>

      {/* Nombre de la comida */}
      <h2 className="text-sm font-sora text-[#242424] font-semibold mt-2 text-center">
        {name}
      </h2>

      {/* Descripción de la comida */}
      <p className="text-[#a2a2a2] font-sora font-light text-xs text-center px-2">
        {description || 'No description'}
      </p>

      {/* Calorías de la comida */}
      <p className="text-md text-[#050505] font-sora font-semibold mt-auto">
        {calories}kcal
      </p>
    </div>
  );
};

export default FoodEntriesCard;