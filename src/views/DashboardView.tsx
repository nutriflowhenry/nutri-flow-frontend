'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Importa el contexto de autenticación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faVenusMars,
    faCircleUser,
    faEnvelope,
    faChildReaching,
    faWeightScale,
    faCakeCandles,
    faSpellCheck
} from '@fortawesome/free-solid-svg-icons';

const DashboardView = () => {
    const { userData, userProfile, logout } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userData) {
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
            <h1 className="text-2xl font-bold mb-6 text-black text-center">Perfil de Usuario</h1>
            {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Información Básica</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                <FontAwesomeIcon icon={faCircleUser} className="mr-2 text-gray-600" />
                                <strong>ID:</strong> {userData.user.id}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faSpellCheck} className="mr-2 text-gray-600" />
                                <strong>Nombre:</strong> {userData.user.name}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-600" />
                                <strong>Email:</strong> {userData.user.email}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Detalles del Perfil</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                <FontAwesomeIcon icon={faCakeCandles} className="mr-2 text-gray-600" />
                                <strong>Edad:</strong> {userProfile?.birthdate
                                    ? new Date(userProfile.birthdate).toLocaleDateString("es-ES", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    : "--"}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faVenusMars} className="mr-2 text-gray-600" />
                                <strong>Género:</strong> {userProfile?.gender || "--"}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faWeightScale} className="mr-2 text-gray-600" />
                                <strong>Peso:</strong> {userProfile?.weight || "--"} kg
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faChildReaching} className="mr-2 text-gray-600" />
                                <strong>Altura:</strong> {userProfile?.height || "--"} cm
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                        >
                            Cerrar Sesión
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