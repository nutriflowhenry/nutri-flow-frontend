'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';  
import Confetti from 'react-confetti'; 

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const WaterCounterView = () => {
    const INCREMENT = 50;
    const DECREMENT = 50;
    const [waterIntake, setWaterIntake] = useState(0);
    const [hydrationGoal, setHydrationGoal] = useState(2000); 
    const [showConfetti, setShowConfetti] = useState(false);
    const [animateAmount, setAnimateAmount] = useState(false); 

    useEffect(() => {
        const fetchUserProfileData = async () => {
            try {
                const token = Cookies.get('token');  
                const user = JSON.parse(Cookies.get('nutriflowUser')); // Obtener datos de usuario desde la cookie
                const userId = user?.userProfile?.id;  // Obtener el userId desde userProfile
                if (!userId) throw new Error('User ID no encontrado');

                // Recuperar el consumo de agua desde localStorage usando el ID de usuario
                const savedWaterIntake = localStorage.getItem(`waterIntake_${userId}`);
                setWaterIntake(savedWaterIntake ? parseInt(savedWaterIntake) : 0); 
                setHydrationGoal(user?.userProfile?.hydrationGoal || 2000); 

            } catch (error) {
                console.error('Error obteniendo los datos del perfil de usuario:', error);
            }
        };

        fetchUserProfileData();
    }, []);

    const updateWaterIntake = async (newIntake, action) => {
        try {
            const token = Cookies.get('token');  
            const user = JSON.parse(Cookies.get('nutriflowUser')); 
            const userId = user?.userProfile?.id; 
            if (!userId) throw new Error('User ID no encontrado');

            const response = await fetch(`${APIURL}/water-tracker/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action }),
            });

            if (!response.ok) throw new Error('Error al actualizar el agua en el backend');

            setWaterIntake(newIntake);
            localStorage.setItem(`waterIntake_${userId}`, newIntake.toString());

            if (newIntake >= hydrationGoal) {
                alert(`🎉 ¡Felicidades! Has alcanzado tu meta diaria de ${hydrationGoal} ml de agua 💧`);
                setShowConfetti(true); 
            }
        } catch (error) {
            console.error('Error actualizando el consumo de agua:', error);
        }
    };

    const addWater = () => {
        setAnimateAmount(true);
        setTimeout(() => setAnimateAmount(false), 500); 
        updateWaterIntake(waterIntake + INCREMENT, 'increment');
    };

    const subtractWater = () => {
        updateWaterIntake(Math.max(waterIntake - DECREMENT, 0), 'decrement');
    };

    const getProgressBarColor = () => {
        const percentage = (waterIntake / hydrationGoal) * 100;
        if (percentage <= 30) return 'bg-red-500'; 
        if (percentage <= 70) return 'bg-yellow-500'; 
        return 'bg-green-500'; 
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-[#c4c1a4] text-white rounded-xl shadow-lg text-center">
            {showConfetti && <Confetti recycle={false} />}

            <h2 className="text-xl font-bold">Contador de Agua</h2>
            <p className="text-sm text-gray-400">Meta diaria: {hydrationGoal} ml</p>
            
            <div className="relative w-full bg-gray-700 h-6 rounded-full mt-4">
                <div
                    className={`${getProgressBarColor()} h-6 rounded-full transition-all`}
                    style={{ width: `${(waterIntake / hydrationGoal) * 100}%` }}
                ></div>
            </div>

            <p 
                className={`mt-2 text-lg ${animateAmount ? 'text-blue-500 text-3xl' : ''}`}
                style={{ transition: 'transform 0.2s ease-in-out' }}
            >
                {waterIntake} ml
            </p>

            <div className="flex gap-4 justify-center mt-4">
                <button
                    onClick={subtractWater}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                >
                    Restar 50ml
                </button>
                <button
                    onClick={addWater}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                    Agregar 50ml
                </button>
            </div>
        </div>
    );
};

export default WaterCounterView;
