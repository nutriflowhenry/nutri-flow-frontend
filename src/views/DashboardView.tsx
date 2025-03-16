'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faVenusMars,
    faEnvelope,
    faChildReaching,
    faWeightScale,
    faCakeCandles,
    faSpellCheck,
} from '@fortawesome/free-solid-svg-icons';

const genderMap = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
};

const DashboardView = () => {
    const { userData } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userData) {
            console.log("En el Dashboard", userData);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [userData]);

    if (loading) {
        return <p className="text-gray-700 text-center py-8">Cargando...</p>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6 text-black text-center">Mi Cuenta {userData?.user.name}</h1>
            {userData ? (
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center space-x-6 w-full max-w-md">
                        <img
                            src={userData.user.profilePicture}
                            alt="Perfil"
                            className="w-32 h-32 rounded-full border-4 border-gray-200"
                        />

                        <div className="flex flex-col space-y-2">
                            {/* <p className="text-xl font-semibold text-gray-800">{userData.user.name}</p> */}
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

                    {/* Tarjeta de versión premium */}
                    <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-sm mt-8 text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">¡Mejora tu experiencia!</h2>
                        <p className="text-gray-700 mb-4">
                            Desbloquea todas las funciones premium y disfruta de una experiencia sin límites.
                        </p>
                        <button
                            onClick={() => alert("Redirigiendo a la compra de la versión premium...")}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Comprar Premium
                        </button>
                    </div>
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