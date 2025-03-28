'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/helpers/auth.helper';
import LoadingModal from '@/components/LoadingModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRobot, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';

export default function PaymentSuccess() {
    const { userData, setUserData } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Actualizar datos del usuario al cargar la página
    useEffect(() => {
        const updateUserData = async () => {
            if (!userData?.token) {
                console.error('No hay token disponible');
                setIsLoading(false);
                return;
            }

            try {
                const updatedUser = await getCurrentUser(userData.token);
                setUserData({
                    ...userData,
                    user: updatedUser,
                    token: userData.token // Aseguramos que token siempre esté definido
                });
            } catch (error) {
                console.error('Error al actualizar datos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        updateUserData();
    }, []);

    const handleRedirect = () => {
        router.push('/dashboard');
    };

    if (isLoading) {
        return <LoadingModal />;
    }

    return (
        <div className="text-gray-700 min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* Modal de éxito */}
            {/* {showSuccessModal && ( */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-white text-5xl mb-4"
                        />
                        <h2 className="text-2xl font-bold text-white">¡Pago Exitoso!</h2>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        <p className="text-lg font-semibold text-center mb-6">
                            ¡Ahora eres <span className="text-yellow-500">Premium</span> y tienes acceso a:
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start">
                                <FontAwesomeIcon icon={faRobot} className="text-emerald-500 mt-1 mr-3" />
                                <div>
                                    <h3 className="font-bold">Chatbot Nutricional</h3>
                                    <p className="text-gray-600 text-sm">Asistente inteligente 24/7 para tus consultas</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <FontAwesomeIcon icon={faUsers} className="text-emerald-500 mt-1 mr-3" />
                                <div>
                                    <h3 className="font-bold">Comunidad Exclusiva</h3>
                                    <p className="text-gray-600 text-sm">Acceso a grupos y contenido premium</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <FontAwesomeIcon icon={faChartLine} className="text-emerald-500 mt-1 mr-3" />
                                <div>
                                    <h3 className="font-bold">Seguimiento Avanzado</h3>
                                    <p className="text-gray-600 text-sm">Estadísticas detalladas de tu progreso</p>
                                </div>
                            </div>


                        </div>

                        {/* Botones */}
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={async () => {
                                    if (!userData?.token) return;

                                    setIsLoading(true);
                                    try {
                                        const updatedUser = await getCurrentUser(userData.token);
                                        setUserData({
                                            ...userData,
                                            user: updatedUser,
                                            token: userData.token // Aseguramos que token esté definido
                                        });
                                        handleRedirect();
                                    } catch (error) {
                                        console.error('Error al actualizar:', error);
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                Comenzar a disfrutar
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {/* )} */}
        </div>
    );
}