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

const WaterCounterView = ({ currentDate }: { currentDate: string }) => {
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

                const savedWaterIntake = localStorage.getItem(`waterIntake_${userId}_${currentDate}`);
                setWaterIntake(savedWaterIntake ? parseInt(savedWaterIntake) : 0);
                setHydrationGoal(user?.userProfile?.hydrationGoal || 2000);
            } catch (error) {
                console.error('Error obteniendo los datos del perfil de usuario:', error);
            }
        };
        fetchUserProfileData();
    }, [currentDate]);

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
            localStorage.setItem(`waterIntake_${userId}_${currentDate}`, newIntake.toString());
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
        <div className="mt-16 mb-16 bg-gradient-to-br from-[#F4EAE0] to-[#CEB58D] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-3xl xl:max-w-4xl p-8 pb-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-sm border border-white/20 mx-auto relative flex flex-col lg:flex-row items-center lg:items-stretch gap-6">
            {/* Efecto de brillo en la esquina superior derecha */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            {showConfetti && <Confetti recycle={false} />}

            {/* Contenido principal a la izquierda en lg */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#242424] flex items-center">
                        <FontAwesomeIcon icon={faDroplet} className="mr-3 text-[#9BA783] text-2xl" />
                        Progreso de Hidratación
                    </h2>
                    <span className="text-[#242424] font-bold text-lg bg-white/50 px-4 py-2 rounded-full">
                        {waterIntake} / {hydrationGoal} ml
                    </span>
                </div>

                {/* Barra de progreso mejorada */}
                <div className="w-full bg-white/30 rounded-full h-3 mt-6 backdrop-blur-sm p-0.5">
                    <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${(waterIntake / hydrationGoal) * 100}%`,
                            backgroundColor: waterIntake >= hydrationGoal ? '#9BA783' : '#9BA783',
                            boxShadow: '0 0 10px rgba(155, 167, 131, 0.3)'
                        }}
                    ></div>
                </div>

                {/* Botones mejorados */}
                <div className="flex justify-center gap-6 mt-6">
                    <button
                        onClick={subtractWater}
                        className="bg-white/50 text-[#242424] px-6 py-3 rounded-full hover:bg-[#CEB58D] transition-all duration-300 font-medium shadow-sm hover:shadow-md backdrop-blur-sm flex items-center gap-2"
                    >
                        <span className="text-xl">-</span> 50ml
                    </button>
                    <button
                        onClick={addWater}
                        disabled={waterIntake >= hydrationGoal}
                        className={`px-6 py-3 rounded-full transition-all duration-300 font-medium shadow-sm hover:shadow-md backdrop-blur-sm flex items-center gap-2 ${
                            waterIntake >= hydrationGoal
                                ? 'bg-white/50 text-[#242424] cursor-not-allowed'
                                : 'bg-[#9BA783] text-white hover:bg-[#8BA978]'
                        }`}
                    >
                        <span className="text-xl">+</span> 50ml
                    </button>
                </div>

                {/* Mensaje de animación mejorado */}
                {animateAmount && (
                    <div className="mt-2 text-center">
                        <div className="text-[#9BA783] animate-pulse bg-white/30 px-4 py-1 rounded-full inline-block backdrop-blur-sm">
                            ¡Bien hecho! +50ml
                        </div>
                    </div>
                )}
            </div>

            {/* Gráfico radial a la derecha en lg */}
            <div className="bg-white/30 p-4 rounded-[20px] backdrop-blur-sm flex-shrink-0 flex justify-center items-center lg:w-[300px] xl:w-[350px]">
                <ApexChart
                    options={{
                        ...chartOptions,
                        fill: {
                            ...chartOptions.fill,
                            colors: ['#9BA783']
                        },
                        plotOptions: {
                            radialBar: {
                                startAngle: -135,
                                endAngle: 135,
                                hollow: {
                                    margin: 0,
                                    size: '70%',
                                    background: 'transparent'
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
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    strokeWidth: '97%',
                                    margin: 5,
                                }
                            }
                        }
                    }}
                    series={chartSeries}
                    type="radialBar"
                    height={250}
                />
            </div>
        </div>
    );
};
export default WaterCounterView;