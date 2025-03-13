'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Confetti from 'react-confetti';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const WaterCounterView = () => {
    const DAILY_GOAL = 2000;
    const INCREMENT = 50;
    const DECREMENT = 50;
    const MID_GOAL = DAILY_GOAL / 2;
    const [waterIntake, setWaterIntake] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchWaterData = async () => {
            try {
                const token = Cookies.get('token');  
                
                if (!token) {
                    return;
                }

                const response = await fetch(`${APIURL}/water-tracker/daily`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Error al obtener los datos');

                const data = await response.json();
                setWaterIntake(data.waterTracker?.amount || 0);
            } catch (error) {
                console.error('Error obteniendo el consumo de agua:', error);
            }
        };

        fetchWaterData();
    }, []);

    const updateWaterIntake = async (newIntake, action) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error("No hay token en las cookies para la actualización");
                return;
            }

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

            if (newIntake === MID_GOAL) {
                alert('¡Vas muy bien! Ya completaste la mitad de tu meta 🎉');
            } else if (newIntake >= DAILY_GOAL) {
                alert('🎉 ¡Felicidades! Has alcanzado tu meta diaria de agua 💧');
            }
        } catch (error) {
            console.error('Error actualizando el consumo de agua:', error);
        }
    };

    const addWater = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
        updateWaterIntake(waterIntake + INCREMENT, 'increment');
    };

    const subtractWater = () => {
        updateWaterIntake(Math.max(waterIntake - DECREMENT, 0), 'decrement');
    };

    const getProgressBarColor = () => {
        const progress = (waterIntake / DAILY_GOAL) * 100;
        if (progress < 30) return "bg-red-500";
        if (progress < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-[#c4c1a4] text-white rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-bold">Contador de Agua</h2>
            <p className="text-sm text-gray-400">Meta diaria: 2L (2000ml)</p>

            <div className="relative w-full bg-gray-700 h-6 rounded-full mt-4">
                <div
                    className={`${getProgressBarColor()} h-6 rounded-full transition-all`}
                    style={{ width: `${(waterIntake / DAILY_GOAL) * 100}%` }}
                ></div>
            </div>

            <p className={`mt-2 text-lg transition-transform ${isAnimating ? "scale-125 text-blue-400" : ""}`}>
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

            {waterIntake >= DAILY_GOAL && <Confetti />}
        </div>
    );
};

export default WaterCounterView;
