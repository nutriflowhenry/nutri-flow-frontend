'use client';

import React, { useState, useEffect } from 'react';
import { IFoodTracker } from '@/types';
import { ClipLoader } from 'react-spinners';

const FoodEntriesCard: React.FC<IFoodTracker> = ({
    name,
    calories,
    description,
    isActive,
    image,
    isImageLoading,
}) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoadingState, setIsImageLoadingState] = useState(!!isImageLoading);

    useEffect(() => {
        if (isImageLoading) {
            setIsImageLoadingState(true);
        } else {
            setIsImageLoadingState(false);
        }
    }, [isImageLoading]);

    if (!isActive) return null;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-2 w-[156px] h-[229px] flex flex-col items-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="w-full h-[120px] rounded-xl overflow-hidden flex items-center justify-center">
                {isImageLoadingState ? (
                    <ClipLoader color="#0070f3" size={24} />
                ) : (
                    <img
                        src={
                            image && !imageError
                                ? image
                                : "https://img.freepik.com/foto-gratis/vista-superior-plato-vacio-cubiertos_23-2148496913.jpg?size=626&ext=jpg"
                        }
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={() => {
                            setImageError(true);
                        }}
                    />
                )}
            </div>

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