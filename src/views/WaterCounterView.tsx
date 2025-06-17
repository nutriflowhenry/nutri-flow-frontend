'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Confetti from 'react-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDroplet,
    faTimes,
    faGlassWater,
    faMugHot,
    faBottleWater,
    faBeerMugEmpty,
    faWineBottle
} from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

const APIURL = process.env.NEXT_PUBLIC_API_URL;
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const WaterCounterView = ({ currentDate }: { currentDate: string }) => {
    const [waterIntake, setWaterIntake] = useState(0);
    const [hydrationGoal, setHydrationGoal] = useState(2000);
    const [showConfetti, setShowConfetti] = useState(false);
    const [animateAmount, setAnimateAmount] = useState(false);
    const [containerSize, setContainerSize] = useState(250);
    const [showContainerModal, setShowContainerModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const containerSizes = [
        { value: 100, label: 'Vaso pequeño', icon: faGlassWater },
        { value: 200, label: 'Vaso mediano', icon: faGlassWater },
        { value: 250, label: 'Taza', icon: faMugHot },
        { value: 330, label: 'Lata', icon: faBeerMugEmpty },
        { value: 500, label: 'Botella pequeña', icon: faBottleWater },
        { value: 1000, label: 'Botella grande', icon: faWineBottle },
    ];


    useEffect(() => {
        const fetchWaterData = async () => {
            setIsLoading(true);
            try {
                const token = Cookies.get('token');
                const userCookie = Cookies.get('nutriflowUser');
                if (!userCookie || !token) throw new Error('Datos de sesión no encontrados');

                const user = JSON.parse(userCookie);
                const userId = user?.userProfile?.id;
                if (!userId) throw new Error('User ID no encontrado');

                // Formatea la fecha en UTC sin hora (para que coincida con el backend)
                const todayUTC = new Date().toISOString().split('T')[0]; // "2025-06-08"

                // Obtener fecha actual en UTC
                const today = new Date();
                // Sumar un día
                today.setDate(today.getDate());
                // Formatear como YYYY-MM-DD
                const tomorrowUTC = today.toISOString().split('T')[0];

                // 1. Obtener datos del backend
                const response = await fetch(`${APIURL}/water-tracker/daily?date=${tomorrowUTC}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const backendAmount = data.waterTracker?.amount || 0;

                    // 2. Actualizar el estado con los datos del backend
                    setWaterIntake(backendAmount);

                    // 3. Opcional: Guardar en localStorage como caché
                    localStorage.setItem(`waterIntake_${userId}_${todayUTC}`, backendAmount.toString());
                    console.log('Datos actualizados desde backend:', backendAmount);

                    // Verificamos si se alcanzó la meta
                    if (backendAmount >= (user?.userProfile?.hydrationGoal || 2000)) {
                        setShowConfetti(true);
                    } else {
                        setShowConfetti(false); // Ocultar confetti si no se alcanzó
                    }
                } else {
                    // Si falla el backend, usa el localStorage como fallback
                    console.error('Error en la respuesta:', await response.text());
                    const savedWaterIntake = localStorage.getItem(`waterIntake_${userId}_${todayUTC}`);
                    setWaterIntake(savedWaterIntake ? parseInt(savedWaterIntake) : 0);
                }

                // Obtener meta de hidratación y tamaño de contenedor
                setHydrationGoal(user?.userProfile?.hydrationGoal || 2000);
                const savedContainerSize = localStorage.getItem(`waterContainerSize_${userId}`);
                if (savedContainerSize) {
                    setContainerSize(parseInt(savedContainerSize));
                }



            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWaterData();
    }, [currentDate]);

    // Función mejorada para actualizar el consumo
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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action,
                    amount: containerSize // Enviamos la cantidad seleccionada
                })
            });

            if (!response.ok) throw new Error('Error al actualizar el agua en el backend');

            const data = await response.json();
            setWaterIntake(data.updatedWaterTracker);
            localStorage.setItem(`waterIntake_${userId}_${currentDate}`, data.updatedWaterTracker.toString());

            if (data.updatedWaterTracker >= hydrationGoal) {
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
        updateWaterIntake(waterIntake + containerSize, 'increment');
    };

    const subtractWater = () => {
        updateWaterIntake(Math.max(waterIntake - containerSize, 0), 'decrement');
    };

    const handleContainerSizeChange = (size: number) => {
        const userCookie = Cookies.get('nutriflowUser');
        if (userCookie) {
            const user = JSON.parse(userCookie);
            const userId = user?.userProfile?.id;
            if (userId) {
                localStorage.setItem(`waterContainerSize_${userId}`, size.toString());
            }
        }
        setContainerSize(size);
        setShowContainerModal(false);
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
            colors: ['#3b82f6']
        },
        stroke: {
            dashArray: 4
        },
        labels: ['Hidratación'],
    };

    const chartSeries = [Math.round((waterIntake / hydrationGoal) * 100)];

    if (isLoading) {
        return (
            <div className="mt-16 mb-16 bg-gradient-to-br from-[#F4EAE0] to-[#CEB58D] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-3xl xl:max-w-4xl p-8 pb-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-sm border border-white/20 mx-auto flex justify-center items-center h-64">
                <div className="animate-pulse text-center">
                    <FontAwesomeIcon icon={faDroplet} className="text-[#9BA783] text-4xl mb-4" />
                    <p className="text-[#242424]">Cargando tu progreso...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 mb-16 bg-gradient-to-br from-[#F4EAE0] to-[#CEB58D] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-3xl xl:max-w-4xl p-8 pb-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-sm border border-white/20 mx-auto relative flex flex-col lg:flex-row items-center lg:items-stretch gap-6">
            {/* Efecto de brillo en la esquina superior derecha */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {showConfetti && <Confetti recycle={false} />}

            {/* Modal para seleccionar tamaño */}
            {showContainerModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 rounded-xl">
                    <div className="bg-gradient-to-br from-[#F4EAE0] to-[#cdbda3] rounded-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setShowContainerModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>

                        <h3 className="text-xl font-bold text-[#242424] mb-6 text-center">
                            Selecciona tu envase
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {containerSizes.map((size) => (
                                <button
                                    key={size.value}
                                    onClick={() => handleContainerSizeChange(size.value)}
                                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${containerSize === size.value
                                        ? 'bg-white border-[#9BA783] scale-105'
                                        : 'bg-white border-gray-200 hover:border-[#9BA783]/50'
                                        }`}
                                >
                                    <FontAwesomeIcon
                                        icon={size.icon}
                                        className={`text-2xl mb-2 ${containerSize === size.value ? 'text-[#9BA783]' : 'text-gray-600'
                                            }`}
                                    />
                                    <span className="text-sm text-gray-500">{size.value}ml</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Personalizado (ml):</label>
                            <div className="flex gap-2 items-center">
                                <FontAwesomeIcon icon={faDroplet} className="text-gray-400" />
                                <input
                                    type="number"
                                    value={containerSize}
                                    onChange={(e) => setContainerSize(parseInt(e.target.value) || 0)}
                                    min="1"
                                    className="flex-1 px-3 py-2 bg-white w-4 md:w-auto text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#9BA783]"
                                    placeholder="Ej: 300"
                                />
                                <span className="text-gray-500 whitespace-nowrap">ml</span>
                                <button
                                    onClick={() => handleContainerSizeChange(containerSize)}
                                    className="bg-[#9BA783] text-white px-4 py-2 rounded-lg hover:bg-[#8BA978] transition-colors"
                                >
                                    Usar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido principal a la izquierda en lg */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm md:text-2xl font-semibold text-[#242424] flex items-center">
                        <FontAwesomeIcon icon={faDroplet} className="mr-3 text-[#9BA783] text-2xl" />
                        Progreso de Hidratación
                    </h2>
                    <span className="text-[#242424] font-bold text-xs md:text-lg bg-white/50 px-4 py-2 rounded-full">
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

                {/* Botón para abrir el modal */}
                <button
                    onClick={() => setShowContainerModal(true)}
                    className="mt-4 bg-white/50 text-[#242424] px-4 py-3 rounded-full transition-all duration-300 font-medium shadow-sm hover:shadow-md backdrop-blur-sm text-sm w-full flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon
                        icon={containerSizes.find(c => c.value === containerSize)?.icon || faDroplet}
                        className="text-[#9BA783]"
                    />
                    {containerSizes.find(c => c.value === containerSize)?.label || `Tamaño personalizado`} ({containerSize}ml)
                </button>

                {/* Botones de accion */}
                <div className="flex justify-center gap-6 mt-6">
                    <button
                        onClick={subtractWater}
                        className="bg-white/50 text-[#242424] px-6 py-3 rounded-full hover:bg-[#CEB58D] transition-all duration-300 font-medium shadow-sm hover:shadow-md backdrop-blur-sm flex items-center gap-2"
                    >
                        <span className="text-xl">-</span> {containerSize}ml
                    </button>
                    <button
                        onClick={addWater}
                        disabled={waterIntake >= hydrationGoal}
                        className={`px-6 py-3 rounded-full transition-all duration-300 font-medium shadow-sm hover:shadow-md backdrop-blur-sm flex items-center gap-2 ${waterIntake >= hydrationGoal
                            ? 'bg-white/50 text-[#242424] cursor-not-allowed'
                            : 'bg-[#9BA783] text-white hover:bg-[#8BA978]'
                            }`}
                    >
                        <span className="text-xl">+</span> {containerSize}ml
                    </button>
                </div>

                {/* Mensaje de animación mejorado */}
                <div className="h-10 mt-2">
                    {animateAmount && (
                        <div className="mt-2 text-center">
                            <div className="text-[#9BA783] animate-pulse bg-white/30 px-4 py-1 rounded-full inline-block backdrop-blur-sm">
                                ¡Bien hecho! +{containerSize}ml
                            </div>
                        </div>
                    )}
                </div>
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