'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Confetti from 'react-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// Import dinámico para ApexCharts
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
                const userCookie = Cookies.get('nutriflowUser');
                if (!userCookie) throw new Error('User cookie not found');

                const user = JSON.parse(userCookie);
                const userId = user?.userProfile?.id;
                if (!userId) throw new Error('User ID no encontrado');

                const savedWaterIntake = localStorage.getItem(`waterIntake_${userId}`);
                setWaterIntake(savedWaterIntake ? parseInt(savedWaterIntake) : 0);
                setHydrationGoal(user?.userProfile?.hydrationGoal || 2000);
            } catch (error) {
                console.error('Error obteniendo los datos del perfil de usuario:', error);
            }
        };
        fetchUserProfileData();
    }, []);

    const updateWaterIntake = async (newIntake: number, action: 'increment' | 'decrement') => {
        try {
            const token = Cookies.get('token');
            const userCookie = Cookies.get('nutriflowUser');
            if (!userCookie) throw new Error('User cookie not found');
            const user = JSON.parse(userCookie);
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
        if (waterIntake >= hydrationGoal) return;

        setAnimateAmount(true);
        setTimeout(() => setAnimateAmount(false), 500);
        updateWaterIntake(waterIntake + INCREMENT, 'increment');
    };

    const subtractWater = () => {
        updateWaterIntake(Math.max(waterIntake - DECREMENT, 0), 'decrement');
    };

    // Configuración del gráfico radial
    const chartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    margin: 0,
                    size: '70%',
                },
                dataLabels: {
                    name: {
                        offsetY: -10,
                        color: '#333',
                        fontSize: '13px'
                    },
                    value: {
                        color: '#333',
                        fontSize: '30px',
                        show: true,
                        formatter: function (val) {
                            return val + '%';
                        }
                    }
                },
                track: {
                    background: '#e0e0e0',
                    strokeWidth: '97%',
                    margin: 5,
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91]
            },
            colors: ['#3b82f6'] // Azul para el agua
        },
        stroke: {
            dashArray: 4
        },
        labels: ['Hidratación'],
    };

    const chartSeries = [Math.round((waterIntake / hydrationGoal) * 100)];

    return (
        <div className="bg-gradient-to-br from-[#fefff5] to-[#d3f6f8] p-6 rounded-[25px] shadow-[-20px_-20px_60px_#FFFFFF,10px_10px_30px_#778474] max-w-md mx-auto md:max-w-[500px]">
            {showConfetti && <Confetti recycle={false} />}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                    <FontAwesomeIcon icon={faDroplet} className="mr-2 text-blue-500" />
                    Progreso de Hidratación
                </h2>
                <span className="text-blue-600 font-bold">
                    {waterIntake} / {hydrationGoal} ml
                </span>
            </div>

            {/* Gráfico radial */}
            <ApexChart
                options={chartOptions}
                series={chartSeries}
                type="radialBar"
                height={250}
            />

            {/* Barra de progreso adicional */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{
                        width: `${(waterIntake / hydrationGoal) * 100}%`,
                        backgroundColor: waterIntake >= hydrationGoal ? '#10B981' : '#3B82F6'
                    }}
                ></div>
            </div>

            {/* Botones */}
            <div className="flex justify-center mt-6 space-x-4">
                <button
                    onClick={subtractWater}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                    - 50ml
                </button>
                <button
                    onClick={addWater}
                    disabled={waterIntake >= hydrationGoal}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${waterIntake >= hydrationGoal
                            ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    + 50ml
                </button>
            </div>

            {/* Mensaje de animación */}
            <div className="h-8 mt-2 text-center">
                {animateAmount && (
                    <div className="text-blue-500 animate-pulse">
                        ¡Bien hecho! +50ml
                    </div>
                )}
            </div>
        </div>
    );
};
export default WaterCounterView;