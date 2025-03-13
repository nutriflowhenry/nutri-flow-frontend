'use client'
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faVenusMars,
    faCircleUser,
    faEnvelope,
    faChildReaching,
    faWeightScale,
    faCakeCandles,
    faSpellCheck,
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { uploadImage } from '@/helpers/uploadImage'; // Asegúrate de importar la función uploadImage

interface FormData {
    birthdate: string;
    gender: string;
    weight: string;
    height: string;
}

const genderMap = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
};

const DashboardView = () => {
    const { userData, userProfile, setUserData, setUserProfile, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
    const [profileFormData, setProfileFormData] = useState<FormData>({
        birthdate: '',
        gender: '',
        weight: '',
        height: ''
    });
    const [userInfoFormData, setUserInfoFormData] = useState({
        name: userData?.user.name || '',
        email: userData?.user.email || ''
    });

    useEffect(() => {
        if (userData) {
            setLoading(false);
            if (userProfile) {
                setProfileFormData({
                    birthdate: userProfile.birthdate ? new Date(userProfile.birthdate).toISOString().split('T')[0] : '',
                    gender: userProfile.gender || '',
                    weight: userProfile.weight?.toString() || '',
                    height: userProfile.height?.toString() || ''
                });
            }
            setUserInfoFormData({
                name: userData.user.name,
                email: userData.user.email
            });
        } else {
            setLoading(false);
        }
    }, [userData, userProfile]);

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileFormData({
            ...profileFormData,
            [name]: value
        });
    };

    const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfoFormData({
            ...userInfoFormData,
            [name]: value
        });
    };

    const handleImageUpload = async (file: File | undefined) => {
        if (!file || !userData) return;

        try {
            const imageUrl = await uploadImage(userData.user.id.toString(), file);

            setUserData({
                ...userData,
                user: {
                    ...userData.user,
                    image: imageUrl,
                },
            });

            Swal.fire({
                title: '¡Éxito!',
                text: 'Imagen de perfil actualizada con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al subir la imagen de perfil',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-profiles`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${userData?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    birthdate: profileFormData.birthdate,
                    gender: profileFormData.gender,
                    weight: parseFloat(profileFormData.weight),
                    height: parseFloat(profileFormData.height)
                })
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setUserProfile(updatedProfile.updatedUserProfile);
                setIsEditingProfile(false);

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Perfil actualizado con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                throw new Error('Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al actualizar el perfil',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const handleUserInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData) {
            console.error("userData es null");
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userData?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userInfoFormData.name,
                    email: userInfoFormData.email
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUserData({
                    ...userData,
                    user: {
                        ...userData.user,
                        name: updatedUser.name,
                        email: updatedUser.email
                    }
                });
                setIsEditingUserInfo(false);

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Información del usuario actualizada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                throw new Error('Error al actualizar la información del usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al actualizar la información del usuario',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    if (loading) {
        return <p className="text-gray-700 text-center py-8">Cargando...</p>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6 text-black text-center">Perfil de Usuario</h1>
            {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sección de Información del Usuario */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Información del Usuario</h2>
                        {isEditingUserInfo ? (
                            <form onSubmit={handleUserInfoSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userInfoFormData.name}
                                        onChange={handleUserInfoChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userInfoFormData.email}
                                        onChange={handleUserInfoChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingUserInfo(false)}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 text-gray-700">
                                <img
                                    src={userData.user.image}
                                    alt="Perfil"
                                    className="w-24 h-24 rounded-full mb-4"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                                />
                                <p>
                                    <FontAwesomeIcon icon={faSpellCheck} className="mr-2 text-gray-600" />
                                    <strong>Nombre:</strong> {userData.user.name}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-600" />
                                    <strong>Email:</strong> {userData.user.email}
                                </p>
                                <button
                                    onClick={() => setIsEditingUserInfo(true)}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Editar Información
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sección de Detalles del Perfil */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Detalles del Perfil</h2>
                        {isEditingProfile ? (
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={profileFormData.birthdate}
                                        onChange={handleProfileInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Género</label>
                                    <select
                                        name="gender"
                                        value={profileFormData.gender}
                                        onChange={handleProfileInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Femenino</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={profileFormData.weight}
                                        onChange={handleProfileInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={profileFormData.height}
                                        onChange={handleProfileInputChange}
                                        step="0.01"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingProfile(false)}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 text-gray-700">
                                <p>
                                    <FontAwesomeIcon icon={faCakeCandles} className="mr-2 text-gray-600" />
                                    <strong>Cumpleaños:</strong> {userProfile?.birthdate
                                        ? new Date(userProfile.birthdate).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "--"}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faVenusMars} className="mr-2 text-gray-600" />
                                    <strong>Género:</strong> {userProfile?.gender ? genderMap[userProfile.gender as keyof typeof genderMap] : "--"}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faWeightScale} className="mr-2 text-gray-600" />
                                    <strong>Peso:</strong> {userProfile?.weight || "--"} kg
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faChildReaching} className="mr-2 text-gray-600" />
                                    <strong>Altura:</strong> {userProfile?.height || "--"} cm
                                </p>
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Editar Perfil
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botón de Cerrar Sesión */}
                    <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
                        <button
                            onClick={logout}
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
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