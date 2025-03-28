'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleSubscription, handleCancelSubscription, getCurrentUser, submitUserReview } from '@/helpers/auth.helper';
import {
    faArrowRight, faCalendarDays, faCheckCircle,
    faComment, faTimes, faPaperPlane
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const router = useRouter();

    const handleReviewSubmit = async () => {
        if (!reviewContent.trim()) {
            setReviewMessage('La reseña no puede estar vacía');
            return;
        }

        if (!userData?.token) {
            setReviewMessage('Debes iniciar sesión');
            return;
        }
        setReviewMessage('Enviando...');

        const { success, message } = await submitUserReview(
            userData.token,
            reviewContent
        );

        setReviewMessage(message);

        if (success) {
            setTimeout(() => {
                setIsReviewModalOpen(false);
                setReviewContent('');
                setReviewMessage('');
            }, 1500);
        }
    };


    // Función para redirigir a la página de notificaciones
    const redirectToNotifications = () => {
        setIsNotificationModalOpen(false);
        router.push('/notifications');
    };


    // Función para crear una sesión de pago
    const handleSubscribe = async () => {
        if (!userData) return;

        setIsLoading(true); // Mostrar el modal de carga

        try {
            const respuesta = await handleSubscription(userData.token);
            if (respuesta.url) {
                window.location.href = respuesta.url;
            } else {
                throw new Error('URL de redirección no encontrada');
            }
        } catch (error) {
            console.error('Error en la suscripción:', error);
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
        } finally {
            setIsLoading(false); // Ocultar el modal de carga
        }
    };




    useEffect(() => {

        // Verificar si el campo country es null
        if (userData?.user?.country === null) {
            setIsNotificationModalOpen(true);
        }

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
    }, [userData, userData?.token]); // Solo ejecuta el efecto cuando el token cambie



    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {isLoading && <LoadingModal />}
            {userData ? (
                <>
                    {/* Banner */}
                    <div className="h-48  bg-cover bg-center relative" style={{ backgroundImage: `url(https://img.freepik.com/fotos-premium/mancuernas-manzana-verde-cinta-metrica_771335-27924.jpg)` }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                        {/* Nombre y Título sobre el Banner */}
                        <div className="absolute bottom-6 text-white md:left-80 left-6" >
                            <p className="text-2xl  font-bold">{userData.user.name}</p>
                            <p className="text-sm "><span className="hidden sm:inline">Suscripción</span> ({userData.user.subscriptionType})</p>
                        </div>
                    </div>

                    {/* Contenedor Principal (Foto de Perfil y Datos) */}
                    <div className="flex flex-col md:flex-row px-6 py-6">
                        {/* Foto de Perfil y Estadísticas (Lado Izquierdo) */}
                        <div className=" w-full md:w-1/3 pr-4 -mt-16 relative z-5 pb-4 ">
                            <div className="flex justify-center">
                                <img
                                    className=" md:h-48 w-48 rounded-full  border-4 border-white object-cover "
                                    src={userData.user.profilePicture || defaultProfilePicture}
                                    alt="Profile"
                                />

                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                                <div className="bg-green-200 p-4 rounded-[25px] text-center">
                                    <p className="text-gray-600 text-sm">Requerimiento de Agua</p>
                                    <p className="text-gray-900 font-bold ">{userData.user.userProfile?.hydrationGoal} ml</p>
                                </div>
                                <div className="bg-orange-200 p-4 rounded-[25px] text-center">
                                    <p className="text-gray-600 text-sm">Límite de Calorías</p>
                                    <p className="text-gray-900 font-bold ">{userData.user.userProfile?.caloriesGoal} kcal</p>
                                </div>

                            </div>
                        </div>

                        {/* Información del Usuario (Lado Derecho) */}
                        <div>
                            <div className=" grid grid-cols-1 sm:grid-cols-2 text-gray-900 sm:gap-4">

                                <p className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-orange-600" style={{ width: '20px', height: '18px' }} />
                                    <strong>Fecha de Nacimiento {userData.user.userProfile?.birthdate
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
                                    <strong>Miembro desde {userData?.user?.createdAt?.split(",")[0]}</strong>
                                </p>
                            </div>
                            <div className="mt-2">

                                <p className="font-bold">
                                    <span className="text-orange-600 ">Email: </span>
                                    <span className="text-gray-900 "> {userData.user.email}</span>
                                </p>

                                <p className="font-bold">
                                    <span className="text-orange-600">Género: </span>
                                    <span className="text-gray-900">{userData.user.userProfile?.gender ? genderMap[userData.user.userProfile?.gender as keyof typeof genderMap] : "--"}</span>
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
                        <div className="w-full flex justify-center">

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
                            <div className="w-full max-w-md bg-gradient-to-r from-orange-400 to-orange-600 p-6 rounded-[25px] shadow-lg mt-3 mb-14 text-center text-white">
                                <h2 className="text-2xl font-semibold mb-4">¡Mejora tu experiencia con NutriFlow Premium!</h2>
                                <p className="text-white mb-4">
                                    Desbloquea todas las funciones premium y disfruta de una experiencia sin límites.
                                </p>
                                <ul className="text-left inline-block mb-6">
                                    <li className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        Chatbot en tiempo real
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        Blog Social de la Comunidad
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        Acceso a recetas exclusivas
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        Monitoreo avanzado del progreso
                                    </li>
                                </ul>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold">$2.00</span>
                                    <span className="text-lg">/mes</span>
                                </div>
                                <button
                                    onClick={handleSubscribe}
                                    className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                                >
                                    ¡Suscríbete ahora!
                                </button>
                                <p className="text-sm mt-4">Oferta especial: 20% de descuento en tu primer mes.</p>
                            </div>
                        </div>

                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-[25px] shadow-lg max-w-md w-full">
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
                                        className="bg-red-500  text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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

                    {isNotificationModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                <h2 className="text-xl text-center font-semibold mb-4 text-gray-800">Actualización de Datos</h2>
                                <p className="text-gray-700 mb-6">
                                    Por favor, completa tus datos de notificaciones para continuar.
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={redirectToNotifications}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Ir a Notificaciones
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección de Reseñas */}
                    <div className="w-full px-6 py-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-sm">
  <div className="text-center max-w-2xl mx-auto">
    <div className="inline-block bg-orange-100 rounded-full p-3 mb-4">
      <FontAwesomeIcon 
        icon={faComment} 
        className="text-orange-500 text-2xl" 
      />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      ¡Tu opinión construye NutriFlow!
    </h2>
    <p className="text-gray-600 mb-6">
      Comparte tu experiencia y ayuda a otros en su viaje saludable. 
      <br />
      ¿Qué te ha parecido usar nuestra plataforma?
    </p>
    <button
      onClick={() => setIsReviewModalOpen(true)}
      className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-200 flex items-center gap-2 mx-auto"
    >
      <FontAwesomeIcon icon={faComment} />
      Comparte tu experiencia
    </button>
    <p className="text-xs text-gray-400 mt-4">
      Solo toma 1 minuto • Reseñas verificadas
    </p>
  </div>
</div>

                    {/* Modal de Reseña */}
                    {isReviewModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 text-black">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in">
                                {/* Header */}
                                <div className="flex justify-between items-center border-b p-4">
                                    <h3 className="text-lg font-semibold">Escribe tu reseña</h3>
                                    <button
                                        onClick={() => {
                                            setIsReviewModalOpen(false);
                                            setReviewMessage('');
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-4">
                                    <textarea
                                        value={reviewContent}
                                        onChange={(e) => {
                                            setReviewContent(e.target.value);
                                            setReviewMessage('');
                                        }}
                                        placeholder="Comparte tu experiencia con NutriFlow..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        rows={5}
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{reviewContent.length}/200 caracteres</p>
                                </div>

                                {/* Footer */}
                                <div className="border-t p-4">
                                    {reviewMessage && (
                                        <p className={`mb-3 text-sm ${reviewMessage.includes('éxito')
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            {reviewMessage}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsReviewModalOpen(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleReviewSubmit}
                                            disabled={!reviewContent.trim()}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            Enviar
                                        </button>
                                    </div>
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