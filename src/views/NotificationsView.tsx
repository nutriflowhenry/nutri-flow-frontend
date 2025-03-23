"use client";

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext'; // Same context as SettingsView
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

interface NotificationsFormData {
    remindersEnabled: boolean;
    country: string;
    city: string;
    phone: string;
}

const NotificationsView = () => {
    const { userData, setUserData } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true);
    const [formData, setFormData] = useState<NotificationsFormData>({
        remindersEnabled: false,
        country: '',
        city: '',
        phone: '',
    });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (userData) {
            setFormData({
                remindersEnabled: userData.user.notifications || false,
                country: userData.user.country || '',
                city: userData.user.city || '',
                phone: userData.user.phone || '',
            }); 
        }

        setLoading(false);
    }, [userData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await Yup.object().shape({
                remindersEnabled: Yup.boolean().required(),
                country: Yup.string().required('Country is required'),
                city: Yup.string().required('City is required'),
                phone: Yup.string().required('Phone number is required'),
            }).validate(formData, { abortEarly: false });

            if (!userData) {
                console.error("User not authenticated");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userData.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country: formData.country,
                    city: formData.city,
                    phone: formData.phone,
                    notifications: formData.remindersEnabled,
                }),
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setUserData({
                    ...userData,
                    user: {
                        ...userData.user,
                        country: updatedProfile.country, 
                        city: updatedProfile.city,      
                        phone: updatedProfile.phone,    
                        notifications: updatedProfile.notifications,
                    },
                });
                setIsEditing(false);

                Swal.fire('¡Éxito!', 'Preferencias de notificaciones actualizadas.', 'success');
                router.back();
            } else {
                throw new Error('Failed to update notifications');
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = error.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.message;
                    return acc;
                }, {} as { [key: string]: string });
                setValidationErrors(errors);
            } else {
                console.error(error);
                Swal.fire('Error', 'Failed to update preferences', 'error');
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-8 bg-white shadow-lg rounded-xl max-w-4xl mx-auto mt-10 mb-10 text-black">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Notificaciones</h1>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Preferencias de Notificación</h2>
                {isEditing ? (
                    <form onSubmit={handleFormSubmit}>
                        <label>
                            Country:
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="">Selecciona tu país</option>
                                <option value="AR">Argentina</option>
                                <option value="CL">Chile</option>
                                <option value="CO">Colombia</option>
                                <option value="PE">Peru</option>
                                <option value="UY">Uruguay</option>
                                <option value="PY">Paraguay</option>
                                <option value="EC">Ecuador</option>
                            </select>
                        </label>
                        {validationErrors.country && (
                            <p className="text-red-500 text-sm">{validationErrors.country}</p>
                        )}
                        <label>
                            Ciudad:
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </label>
                        {validationErrors.city && (
                            <p className="text-red-500 text-sm">{validationErrors.city}</p>
                        )}
                        <label>
                            Numero Telefónico:
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </label>
                        {validationErrors.phone && (
                            <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                        )}
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="remindersEnabled"
                                checked={formData.remindersEnabled}
                                onChange={handleInputChange}
                                className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span>¿Deseas recibir recordatorios regulares?</span>
                        </label>
                        {validationErrors.remindersEnabled && (
                            <p className="text-red-500 text-sm">{validationErrors.remindersEnabled}</p>
                        )}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                ) : ( 
                    <p className="text-gray-700">Click to update your notification preferences.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsView;