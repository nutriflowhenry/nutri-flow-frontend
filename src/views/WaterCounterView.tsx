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
    const [showConfetti, setShowConfetti] = useState(false);
    const [animateAmount, setAnimateAmount] = useState(false); 

    useEffect(() => {
        const fetchWaterData = async () => {
            try {
                const token = Cookies.get('token');  
                console.log("Token en cookies:", token); 

                if (!token) {
                    console.error("No hay token en las cookies");
                    return;
                }

                const response = await fetch(`${APIURL}/water-tracker/daily`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response);

                if (!response.ok) throw new Error('Error al obtener los datos');

                const data = await response.json();
                setWaterIntake(data.waterTracker?.amount || 0);
            } catch (error) {
                console.error('Error obteniendo el consumo de agua:', error);
            }
        };

        fetchWaterData();
    }, []);

    const updateWaterIntake = async (newIntake: number, action: string) => {
        try {
            const token = Cookies.get('token');  
            console.log("Token en cookies para actualización:", token); 

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

            console.log(response);

            if (!response.ok) throw new Error('Error al actualizar el agua en el backend');

            setWaterIntake(newIntake);
            localStorage.setItem('waterIntake', newIntake.toString());
            localStorage.setItem('lastDrinkDate', new Date().toDateString());

            if (newIntake === MID_GOAL) {
                alert('¡Vas muy bien! Ya completaste la mitad de tu meta 🎉');
            } else if (newIntake >= DAILY_GOAL) {
                alert('🎉 ¡Felicidades! Has alcanzado tu meta diaria de agua 💧');
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
        const percentage = (waterIntake / DAILY_GOAL) * 100;
        if (percentage <= 30) return 'bg-red-500'; // Muy bajo
        if (percentage <= 70) return 'bg-yellow-500'; // Buen progreso
        return 'bg-green-500'; // Excelente
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-[#c4c1a4] text-white rounded-xl shadow-lg text-center">
            {/* Confeti */}
            {showConfetti && <Confetti recycle={false} />}

            <h2 className="text-xl font-bold">Contador de Agua</h2>
            <p className="text-sm text-gray-400">Meta diaria: 2L (2000ml)</p>

            <div className="relative w-full bg-gray-700 h-6 rounded-full mt-4">
                <div
                    className={`${getProgressBarColor()} h-6 rounded-full transition-all`}
                    style={{ width: `${(waterIntake / DAILY_GOAL) * 100}%` }}
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
