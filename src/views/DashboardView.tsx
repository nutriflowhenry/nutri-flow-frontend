'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleSubscription, handleCancelSubscription, getCurrentUser } from '@/helpers/auth.helper';
import {
    faArrowRight,
    faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import LoadingModal from '@/components/LoadingModal';

const genderMap = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
};
const defaultProfilePicture = 'https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png';

const DashboardView = () => {
    const { userData, setUserData } = useAuth();
    const [error, setError] = useState<string | null>(null);
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
            setError('Error al procesar la suscripción. Inténtalo de nuevo.');
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
            setError('Error al cancelar la suscripción. Inténtalo de nuevo.');
        } finally {
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
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {isLoading && <LoadingModal />}
            {/* <h1 className="text-2xl font-bold mb-6 text-black text-center">Mi Perfil</h1> */}
            {userData ? (
                <>
                    {/* Banner */}
                    <div className="h-32  bg-cover bg-center relative" style={{ backgroundImage: `url(${userData.user.profilePicture})` }}>
                        <div className="absolute inset-0 bg-orange-500 bg-opacity-50"></div>

                        {/* Nombre y Título sobre el Banner */}
                        <div className="absolute bottom-4 text-white" style={{ left: '35%' }}>
                            <p className="text-xl leading-tight font-bold">{userData.user.name}</p>
                            <p className="text-sm leading-tight">({userData.user.subscriptionType})</p>
                        </div>
                    </div>

                    {/* Contenedor Principal (Foto de Perfil y Datos) */}
                    <div className="flex px-6 py-4">
                        {/* Foto de Perfil y Estadísticas (Lado Izquierdo) */}
                        <div className="w-1/3 pr-4 -mt-16 relative z-5 pb-4">
                            <img
                                className="w-80 ms:h-48 rounded-lg  border-4 border-white"
                                src={userData.user.profilePicture || defaultProfilePicture}
                                alt="Profile"
                            />
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                                <div className="bg-blue-200 p-4 rounded-lg text-center">
                                    <p className="text-gray-600 text-sm">Daily Water</p>
                                    <p className="text-gray-900 font-bold ">{userData.user.userProfile?.hydrationGoal} ml</p>
                                </div>
                                <div className="bg-orange-200 p-4 rounded-lg text-center">
                                    <p className="text-gray-600 text-sm">Daily Calories</p>
                                    <p className="text-gray-900 font-bold ">{userData.user.userProfile?.caloriesGoal} kcal</p>
                                </div>

                            </div>
                        </div>

                        {/* Información del Usuario (Lado Derecho) */}
                        <div>
                            <div className=" grid grid-cols-1 sm:grid-cols-2 text-gray-900 sm:gap-4">

                                <p className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-orange-600" style={{ width: '20px', height: '18px' }} />
                                    <strong>Cumpleaños {userData.user.userProfile?.birthdate
                                        ? new Date(userData.user.userProfile.birthdate).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "--"} 
                                    </strong>
                                </p>
                                <p className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-orange-600" style={{ width: '20px', height: '18px' }} />
                                    <strong>Miembro desde {userData?.user?.createdAt?.split(",")[0]} </strong>
                                </p>
                            </div>
                            <div className="mt-2">

                                <p className="font-bold">
                                    <span className="text-orange-600 hidden sm:inline">Email Address: </span>
                                    <span className="text-black"> {userData.user.email}</span>
                                </p>

                                <p className="font-bold">
                                    <span className="text-orange-600">Género: </span>
                                    <span className="text-black">{userData.user.userProfile?.gender ? genderMap[userData.user.userProfile?.gender as keyof typeof genderMap] : "--"}</span>
                                </p>
                                <p className="font-bold">
                                    <span className="text-orange-600">Altura: </span>
                                    <span className="text-gray-900">{userData.user.userProfile?.height || "--"} cm</span>
                                </p>
                                <p className="font-bold">
                                    <span className="text-orange-600">Peso: </span>
                                    <span className="text-gray-900">{userData.user.userProfile?.weight || "--"} kg</span>
                                </p>

                            </div>
                        </div>
                    </div>


                    {userData.user.subscriptionType === "premium" ? (

                        // {/* Opciones de suscripción y pagos */}
                        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-sm mt-3 mb-8 text-center">

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
                        </div>
                    ) : (
                        // {/* Tarjeta de versión premium */}
                        <div className="w-full flex justify-center">

                            <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-sm mt-3 mb-8 text-center">
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


                </>

            ) : (
                <div className="text-black text-center">
                    <p>No se encontraron datos del usuario.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardView;