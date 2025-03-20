'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleSubscription, handleCancelSubscription, getCurrentUser } from '@/helpers/auth.helper';
import {
    faVenusMars,
    faChildReaching,
    faWeightScale,
    faCakeCandles,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
// import Cookies from 'js-cookie';
import LoadingModal from '@/components/LoadingModal';

const genderMap = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
};

const DashboardView = () => {
    const { userData, setUserData } = useAuth();
    // const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Función para crear una sesión de pago
    const handleSubscribe = async () => {
        if (!userData) return;

        setIsLoading(true); // Mostrar el modal de carga

        try {
            const respuesta = await handleSubscription(userData.token);
            console.log("Redireccion del pay: ", respuesta.url);
            if (respuesta.url) {
                window.location.href = respuesta.url;
            } else {
                throw new Error('URL de redirección no encontrada');
            }
        } catch (error) {
            console.error('Error en la suscripción:', error);
            // setError('Error al procesar la suscripción. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false); // Ocultar el modal de carga
        }
    };

    // Función para abrir el modal de cancelación
    const openCancelModal = () => {
        setIsModalOpen(true);
    };

    // Función para cerrar el modal de cancelación
    const closeCancelModal = () => {
        setIsModalOpen(false);
    };

    // Función para confirmar la cancelación de la suscripción
    const confirmCancelSubscription = async () => {
        if (!userData) return;

        try {
            const response = await handleCancelSubscription(userData.token);
            console.log("Suscripción cancelada:", response);

            const updatedUser = await getCurrentUser(userData.token);

            // Actualiza el estado del usuario
            setUserData({
                ...userData,
                user: updatedUser,
            });

            closeCancelModal();
        } catch (error) {
            console.error('Error al cancelar la suscripción:', error);
            // setError('Error al cancelar la suscripción. Inténtalo de nuevo.');
        }  finally {
            setIsLoading(false); // Ocultar el modal de carga
        }
    };


    useEffect(() => {
        const updateUserDataAfterPayment = async () => {
            if (userData?.token) {
                try {
                    // Obtén los datos actualizados del usuario
                    const updatedUser = await getCurrentUser(userData.token);

                    // Actualiza el estado del usuario
                    setUserData({
                        ...userData,
                        user: updatedUser,
                    });
                    
                } catch (error) {
                    console.error("Error al actualizar los datos del usuario después del pago:", error);
                }
            }
        };

        updateUserDataAfterPayment();
    }, [userData?.token]); // Solo ejecuta el efecto cuando el token cambie



    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-8">
            {isLoading && <LoadingModal />}
            <h1 className="text-2xl font-bold mb-6 text-black text-center">Mi Perfil</h1>
            {userData ? (
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center space-x-6 w-full max-w-md">
                        <img
                            src={userData.user.profilePicture}
                            alt="Perfil"
                            className="w-32 h-32 rounded-full border-4 border-gray-200"
                        />

                        <div className="flex flex-col space-y-2">
                            <p className="text-xl font-semibold text-gray-800">{userData.user.name}</p>
                            <p className="text-gray-600">{userData.user.email}</p>
                            <p className="text-gray-600">
                                Miembro desde el {userData?.user?.createdAt?.split(",")[0]}

                            </p>
                            <p className="text-gray-600">
                                Suscripción: {userData.user.subscriptionType}

                            </p>
                        </div>
                    </div>

                    {/* Detalles del perfil */}
                    <div className="w-full max-w-md space-y-4 text-gray-700">
                        <p>
                            <FontAwesomeIcon icon={faCakeCandles} className="mr-2 text-gray-600" />
                            <strong>Cumpleaños:</strong> {userData.user.userProfile?.birthdate
                                ? new Date(userData.user.userProfile.birthdate).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : "--"}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faVenusMars} className="mr-2 text-gray-600" />
                            <strong>Género:</strong> {userData.user.userProfile?.gender ? genderMap[userData.user.userProfile?.gender as keyof typeof genderMap] : "--"}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faWeightScale} className="mr-2 text-gray-600" />
                            <strong>Peso:</strong> {userData.user.userProfile?.weight || "--"} kg
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faChildReaching} className="mr-2 text-gray-600" />
                            <strong>Altura:</strong> {userData.user.userProfile?.height || "--"} cm
                        </p>
                    </div>

                    {userData.user.subscriptionType === "premium" ? (

                        // {/* Opciones de suscripción y pagos */}
                        <div className="w-full max-w-md space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Suscripciones y pagos</h2>
                                <div className="space-y-4">
                                    <div
                                        onClick={() => router.push('/dashboard/payHistory')}
                                        className="flex justify-between items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-gray-700">Ver historial de compras</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
                                    </div>
                                    <div
                                        onClick={openCancelModal}
                                        className="flex justify-between items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-gray-700">Cancelar Suscripción</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // {/* Tarjeta de versión premium */}

                        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-sm mt-8 text-center">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">¡Mejora tu experiencia!</h2>
                            <p className="text-gray-700 mb-4">
                                Desbloquea todas las funciones premium y disfruta de una experiencia sin límites.
                            </p>
                            <button
                                onClick={handleSubscribe}
                                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Suscribirse a Premium
                            </button>
                        </div>

                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                <h2 className="text-xl text-center font-semibold mb-4 text-gray-800">Solicitud de Cancelación</h2>
                                <p className="text-gray-700 mb-6">
                                    Estás a punto de cancelar tu suscripción a NutriFlow. Esta acción es irreversible y perderás acceso a todas las funcionalidades premium.
                                </p>
                                <p className="text-gray-700 mb-6">
                                    ¿Deseas continuar con la cancelación?
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={confirmCancelSubscription}
                                        className="bg-gray-300  text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Confirmar Cancelación
                                    </button>
                                    <button
                                        onClick={closeCancelModal}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-black text-center">
                    <p>No se encontraron datos del usuario.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardView;