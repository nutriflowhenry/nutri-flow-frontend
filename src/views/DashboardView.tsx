'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleSubscription, handleCancelSubscription, getCurrentUser, submitUserReview } from '@/helpers/auth.helper';
import {
    faArrowRight, faCalendarDays, faCheckCircle,
    faComment, faTimes, faPaperPlane, faCrown, faWater,
    faVenusMars, faRulerVertical, faChartLine, faWeight, faHistory
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import LoadingModal from '@/components/LoadingModal';
import FavoritesView from "./FavoritesView";

const genderMap = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
};

const defaultProfilePicture = 'https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png';


const DashboardView = () => {
    const { userData, setUserData } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    }, []); // Solo ejecuta el efecto cuando el token cambie



    return (
        <div className="min-h-screen font-sora">
            {isLoading && <LoadingModal />}
            {userData ? (
                <div className="max-w-6xl mx-auto p-4 md:p-6 mt-4 md:mt-3">
                    {/* Profile Header */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
                        {/* Banner */}
                        <div className="h-20 bg-gradient-to-r from-[#6b8f71] to-[#9BA783] relative">
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        </div>



                        {/* Profile Info */}
                        <div className="relative px-6 pb-6 -mt-16">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                                {/* Profile Picture */}
                                <div className="relative">
                                    <img
                                        className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white shadow-lg object-cover"
                                        src={userData?.user?.profilePicture || defaultProfilePicture}
                                        alt="Profile"
                                    />
                                    {userData?.user?.subscriptionType === "premium" && (
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
                                            <FontAwesomeIcon icon={faCrown} className="mr-1" />
                                            PREMIUM
                                        </div>
                                    )}
                                </div>

                                {/* Name and Info */}
                                <div className="md:absolute flex-1 md:bottom-1/4 md:left-52">
                                    <h1 className="text-3xl font-bold mb-1 text-gray-700 md:text-white">{userData?.user?.name || "Usuario"}</h1>
                                    <p className="text-lg opacity-90 mb-4 text-gray-700">
                                        {userData?.user?.email}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-gray-700">
                                        <span className="bg-gray-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                                            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
                                            Miembro desde {userData?.user?.createdAt?.split(",")[0]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Column - Stats */}
                        <div className="lg:w-1/3 space-y-6">
                            {/* Health Goals */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 text-black">
                                <h2 className="text-xl font-semibold text-[#5a5f52] mb-4">Mis Objetivos</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-[#F4EAE0] rounded-xl">
                                        <div>
                                            <p className="text-sm text-[#9BA783]">Hidratación Diaria</p>
                                            <p className="text-2xl font-bold">{userData?.user?.userProfile?.hydrationGoal || "--"} ml</p>
                                        </div>
                                        <div className="text-[#6b8f71] text-2xl">
                                            <FontAwesomeIcon icon={faWater} />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-[#E6F0D9] rounded-xl">
                                        <div>
                                            <p className="text-sm text-[#7A8B5C]">Límite de Calorías</p>
                                            <p className="text-2xl font-bold">{userData?.user?.userProfile?.caloriesGoal || "--"} kcal</p>
                                        </div>
                                        <div className="text-[#7A8B5C] text-2xl">
                                            <FontAwesomeIcon icon={faChartLine} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-[#5a5f52] mb-4">Información Personal</h2>
                                <div className="space-y-3 text-black">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCalendarDays} className="text-[#CEB58D] w-5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                                            <p>{userData?.user?.userProfile?.birthdate
                                                ? new Date(userData.user.userProfile.birthdate).toLocaleDateString("es-ES")
                                                : "--"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faVenusMars} className="text-[#CEB58D] w-5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Género</p>
                                            <p>{userData?.user?.userProfile?.gender
                                                ? genderMap[userData.user.userProfile.gender as keyof typeof genderMap]
                                                : "--"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faRulerVertical} className="text-[#CEB58D] w-5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Altura</p>
                                            <p>{userData?.user?.userProfile?.height || "--"} cm</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faWeight} className="text-[#CEB58D] w-5 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Peso</p>
                                            <p>{userData?.user?.userProfile?.weight || "--"} kg</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/3 space-y-6">




                            {/* Right Column - Main Content */}
                            {/* <div className="lg:col-span-2 space-y-6 text-gray-700"> */}
                            {userData?.user?.subscriptionType === "premium" ? (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-[#5a5f52] mb-4">Tu Suscripción Premium</h2>
                                    <div className="space-y-4">
                                        <div
                                            onClick={() => router.push('/dashboard/payHistory')}
                                            className="flex justify-between items-center p-4 hover:bg-[#F4EAE0] rounded-lg cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faHistory} className="text-[#CEB58D] mr-3" />
                                                <span>Historial de pagos</span>
                                            </div>
                                            <FontAwesomeIcon icon={faArrowRight} className="text-[#CEB58D]" />
                                        </div>

                                        <div
                                            onClick={openCancelModal}
                                            className="flex justify-between items-center p-4 hover:bg-[#F4EAE0] rounded-lg cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faTimes} className="text-red-400 mr-3" />
                                                <span>Cancelar suscripción</span>
                                            </div>
                                            <FontAwesomeIcon icon={faArrowRight} className="text-[#CEB58D]" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-6 text-white">
                                        <div className="flex items-start">
                                            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                                                <FontAwesomeIcon icon={faCrown} className="text-xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2">¡Mejora tu experiencia con NutriFlow Premium!</h2>
                                                <p className="mb-4 opacity-90">
                                                    Desbloquea todas las funciones premium y disfruta de una experiencia sin límites.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="my-6">
                                            <div className="flex items-center justify-center mb-4">
                                                <span className="text-4xl font-bold mr-2">$2.00</span>
                                                <span className="text-lg opacity-90">/mes</span>
                                            </div>

                                            <ul className="space-y-3 mb-6">
                                                <li className="flex items-center">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                                    Chatbot en tiempo real
                                                </li>
                                                <li className="flex items-center">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                                    Blog Social de la Comunidad
                                                </li>
                                                <li className="flex items-center">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                                    Acceso a recetas exclusivas
                                                </li>
                                                <li className="flex items-center">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                                    Monitoreo avanzado del progreso
                                                </li>
                                            </ul>

                                            <button
                                                onClick={handleSubscribe}
                                                className="w-full bg-white text-orange-600 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg"
                                            >
                                                ¡Quiero ser Premium!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className=" rounded-2xl shadow-sm p-6">

                                <FavoritesView />
                            </div>

                            {/* Review Section */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center bg-orange-100 w-16 h-16 rounded-full mb-4">
                                        <FontAwesomeIcon icon={faComment} className="text-orange-500 text-2xl" />
                                    </div>
                                    <h2 className="text-xl font-bold text-[#5a5f52] mb-2">
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
                                        <FontAwesomeIcon icon={faComment} className="mr-2" />
                                        Escribe una reseña
                                    </button>
                                    <p className="text-xs text-gray-400 mt-4">
                                        Solo toma 1 minuto • Reseñas verificadas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Cancel Subscription Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 text-gray-700">
                            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
                                <div className="p-6">
                                    <div className="text-center mb-2">
                                        <FontAwesomeIcon icon={faTimes} className="text-red-500 text-4xl mb-3" />
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Solicitud de Cancelación</h3>
                                        <p className="text-gray-600">
                                            Estás a punto de cancelar tu suscripción a NutriFlow. Esta acción es irreversible y perderás acceso a todas las funcionalidades premium.
                                        </p>
                                        <p className="text-gray-700 mb-6">
                                            ¿Deseas continuar con la cancelación?
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-4 mt-6">
                                        <button
                                            onClick={closeCancelModal}
                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Volver
                                        </button>
                                        <button
                                            onClick={confirmCancelSubscription}
                                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review Modal */}
                    {isReviewModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 text-black">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Escribe tu reseña</h3>
                                        <button
                                            onClick={() => setIsReviewModalOpen(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>

                                    <textarea
                                        value={reviewContent}
                                        onChange={(e) => {
                                            setReviewContent(e.target.value);
                                            setReviewMessage('');
                                        }}
                                        placeholder="¿Qué te parece NutriFlow?"
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        rows={5}
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{reviewContent.length}/200 caracteres</p>

                                    {reviewMessage && (
                                        <p className={`mt-2 text-sm ${reviewMessage.includes('éxito') ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                            {reviewMessage}
                                        </p>
                                    )}

                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            onClick={() => setIsReviewModalOpen(false)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleReviewSubmit}
                                            disabled={!reviewContent.trim()}
                                            className="px-4 py-2  bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            Enviar
                                        </button>
                                    </div>
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