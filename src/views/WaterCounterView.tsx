'use client';

import React, { useState, useEffect } from 'react';

const WaterCounterView = () => {
    const DAILY_GOAL = 2000;
    const INCREMENT = 50;
    const DECREMENT = 50;
    const [waterIntake, setWaterIntake] = useState(0);

    useEffect(() => {
        const fetchWaterData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await fetch('http://localhost:3000/water-tracker/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ action: 'FETCH' }) 
                });

                console.log('Response status:', response.status);

                if (!response.ok) throw new Error(`Error al obtener los datos: ${response.statusText}`);

                const data = await response.json();
                console.log('Data recibida:', data);

                setWaterIntake(data.waterTracker?.amount || 0);
            } catch (error) {
                console.error('Error obteniendo el consumo de agua:', error);
            }
        };

        fetchWaterData();
    }, []);

    const updateWaterIntake = async (newIntake: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch('http://localhost:3000/water-tracker/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: newIntake, action: 'INCREMENT' }),
            });

            if (!response.ok) throw new Error('Error al actualizar el agua en el backend');

            setWaterIntake(newIntake);
            localStorage.setItem('waterIntake', newIntake.toString());
            localStorage.setItem('lastDrinkDate', new Date().toDateString());
        } catch (error) {
            console.error('Error actualizando el consumo de agua:', error);
        }
    };

    const addWater = () => {
        updateWaterIntake(waterIntake + INCREMENT);
    };

    const subtractWater = () => {
        updateWaterIntake(Math.max(waterIntake - DECREMENT, 0));
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-bold">Contador de Agua</h2>
            <p className="text-sm text-gray-400">Meta diaria: 2L (2000ml)</p>

            <div className="relative w-full bg-gray-700 h-6 rounded-full mt-4">
                <div
                    className="bg-blue-500 h-6 rounded-full transition-all"
                    style={{ width: `${(waterIntake / DAILY_GOAL) * 100}%` }}
                ></div>
            </div>

            <p className="mt-2 text-lg">{waterIntake} ml</p>

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
