'use client';

import React, { useState, useEffect } from 'react';
import { IFoodTracker } from '@/types';
import { ClipLoader } from 'react-spinners'; // Importa el spinner de React Spinners

const FoodEntriesCard: React.FC<IFoodTracker> = ({
    id,
    name,
    calories,
    description,
    isActive,
    image,
}) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true); // Estado para manejar la carga de la imagen

    useEffect(() => {
        if (image) {
            setIsImageLoading(true); // Activar el loader cuando hay una imagen
        }
    }, [image]);

    if (!isActive) return null;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-2 w-[156px] h-[229px] flex flex-col items-center">
            {/* Contenedor de la imagen con spinner */}
            <div className="w-full h-[120px] rounded-xl overflow-hidden flex items-center justify-center">
                {isImageLoading && (
                    <ClipLoader color="#0070f3" size={24} /> // Spinner de React Spinners
                )}
                <img
                    src={
                        image && !imageError
                            ? image
                            : "https://img.freepik.com/foto-gratis/vista-superior-plato-vacio-cubiertos_23-2148496913.jpg?size=626&ext=jpg"
                    }
                    alt={name}
                    className={`w-full h-full object-cover ${isImageLoading ? 'hidden' : 'block'}`} // Oculta la imagen mientras se carga
                    onLoad={() => setIsImageLoading(false)} // Desactiva el spinner cuando la imagen se carga
                    onError={() => {
                        setImageError(true);
                        setIsImageLoading(false); // Desactiva el spinner si hay un error
                    }}
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