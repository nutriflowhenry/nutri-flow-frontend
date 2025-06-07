"use client";

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
        
        if (name === 'phone') {
            const cleanedValue = value.replace(/[^0-9+]/g, '');
            const finalValue = cleanedValue.startsWith('+') ? 
                '+' + cleanedValue.slice(1).replace(/[^0-9]/g, '') : 
                cleanedValue.replace(/[^0-9]/g, '');
            
            setFormData({ ...formData, [name]: finalValue });
            return;
        }
        
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await Yup.object().shape({
                remindersEnabled: Yup.boolean().required(),
                country: Yup.string().required('País es requerido'),
                city: Yup.string()
                    .required('Ciudad es requerida')
                    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'La ciudad solo debe contener letras'),
                phone: Yup.string()
                    .required('Número telefónico es requerido')
                    .matches(/^\+[0-9]+$/, 'El número debe comenzar con + y solo contener números')
                    .min(8, 'El número telefónico debe tener al menos 8 dígitos'),
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

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Preferencias de notificaciones actualizadas.',
                    icon: 'success',
                    background: '#F4EAE0',
                    color: '#5a5f52',
                    confirmButtonColor: '#6b8f71'
                });
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
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar preferencias',
                    icon: 'error',
                    background: '#F4EAE0',
                    color: '#5a5f52',
                    confirmButtonColor: '#6b8f71'
                });
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F4EAE0] flex justify-center items-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b8f71]"
            ></motion.div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#F4EAE0] py-12 px-4 sm:px-6 lg:px-8 font-sora"
        >
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-10">
                    <motion.h1 
                        className="text-4xl font-bold text-[#5a5f52] mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Configuración de Notificaciones
                    </motion.h1>
                    <motion.p 
                        className="text-lg text-[#5a5f52]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Personaliza cómo deseas recibir tus recordatorios y notificaciones
                    </motion.p>
                </div>

                <motion.div 
                    className="bg-[#e7e3d8] p-8 rounded-2xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-[#5a5f52] border-b border-[#a7b8a8] pb-2">
                        Preferencias de Notificación
                    </h2>
                    
                    {isEditing ? (
                        <form onSubmit={handleFormSubmit}>
                            <motion.div 
                                className="mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label className="block text-[#5a5f52] mb-3 font-medium">
                                    País:
                                </label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-xl border border-[#a7b8a8] bg-white focus:ring-2 focus:ring-[#6b8f71] focus:border-[#6b8f71] text-[#5a5f52]"
                                    required
                                >
                                    <option value="">Selecciona tu país</option>
                                    <option value="AR">Argentina</option>
                                    <option value="CL">Chile</option>
                                    <option value="CO">Colombia</option>
                                    <option value="PE">Perú</option>
                                    <option value="UY">Uruguay</option>
                                    <option value="PY">Paraguay</option>
                                    <option value="EC">Ecuador</option>
                                </select>
                                {validationErrors.country && (
                                    <p className="text-red-600 text-sm mt-2">{validationErrors.country}</p>
                                )}
                            </motion.div>
                            
                            <motion.div 
                                className="mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label className="block text-[#5a5f52] mb-3 font-medium">
                                    Ciudad:
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-xl border border-[#a7b8a8] bg-white focus:ring-2 focus:ring-[#6b8f71] focus:border-[#6b8f71] text-[#5a5f52]"
                                    required
                                />
                                {validationErrors.city && (
                                    <p className="text-red-600 text-sm mt-2">{validationErrors.city}</p>
                                )}
                            </motion.div>
                            
                            <motion.div 
                                className="mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <label className="block text-[#5a5f52] mb-3 font-medium">
                                    Número Telefónico:
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-xl border border-[#a7b8a8] bg-white focus:ring-2 focus:ring-[#6b8f71] focus:border-[#6b8f71] text-[#5a5f52]"
                                    required
                                    placeholder="+541112345678"
                                />
                                {validationErrors.phone && (
                                    <p className="text-red-600 text-sm mt-2">{validationErrors.phone}</p>
                                )}
                            </motion.div>
                            
                            <motion.div 
                                className="mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="remindersEnabled"
                                            checked={formData.remindersEnabled}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`block w-12 h-6 rounded-full ${formData.remindersEnabled ? 'bg-[#6b8f71]' : 'bg-[#a7b8a8]'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${formData.remindersEnabled ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="text-[#5a5f52] font-medium">¿Deseas recibir recordatorios regulares?</span>
                                </label>
                                {validationErrors.remindersEnabled && (
                                    <p className="text-red-600 text-sm mt-2">{validationErrors.remindersEnabled}</p>
                                )}
                            </motion.div>
                            
                            <motion.div 
                                className="flex justify-end space-x-4 mt-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <motion.button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-3 rounded-xl bg-[#a7b8a8] text-[#5a5f52] font-medium hover:bg-[#95a79a] transition-colors"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancelar
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-[#6b8f71] text-white font-medium hover:bg-[#5a7c62] transition-colors"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Guardar Cambios
                                </motion.button>
                            </motion.div>
                        </form>
                    ) : ( 
                        <div className="text-center py-8">
                            <p className="text-[#5a5f52]">Tus preferencias de notificación han sido guardadas.</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default NotificationsView;