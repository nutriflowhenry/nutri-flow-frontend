'use client'
import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { AuthContext } from '@/context/AuthContext'
import { IPhysicalForm } from '@/types/physicalForm'
import { useRouter } from 'next/navigation'
import { IUserProfile } from '@/types'
import { fetchUserProfile } from '@/helpers/auth.helper'
import { createProfile } from '@/helpers/profile.helper'

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const PhysicalFormView = () => {
    const { userData, setUserData } = useContext(AuthContext);
    const router = useRouter(); 

    const formik = useFormik<IPhysicalForm>({
        initialValues: {
            peso: 60,
            altura: 1.65,
            edad: 20,
            genero: '',
        },
        onSubmit: async (values) => {
            if (!userData) {
                console.error("Usuario no autenticado.");
                return;
            }

        
            const birthdate = new Date(new Date().getFullYear() - values.edad, 0, 1).toISOString().split("T")[0];

            const translatedValues = {
                weight: values.peso,
                height: values.altura,
                birthdate: birthdate, 
                gender: values.genero === "masculino" ? "male" : values.genero === "femenino" ? "female" : "other"
            };

            await createProfile(userData.token, translatedValues);

            // Actualizar el estado de `userData` con el nuevo `userProfile`
            let profileData: IUserProfile | undefined;
            try {
                profileData = await fetchUserProfile(userData.token);
               
            } catch (error) {
                console.warn("No se pudo obtener el perfil del usuario:", error);
            }    
            
            if (userData) { 
                               
                setUserData({
                    ...userData,
                    user: {
                        ...userData.user,
                        userProfile: profileData, // Reemplaza userProfile con los datos de la respuesta
                    },
                });
            }
                
            return router.push("/home");
        },

        
        validate: (values) => {
            const errors: Partial<IPhysicalForm> = {}; 
            if (!values.peso) {
                errors.peso = "El peso es obligatorio";
            } else if (values.peso < 20 || values.peso > 300) {
                errors.peso = "El peso debe estar entre 20kg y 300kg";
            }

            if (!values.altura) {
                errors.altura = "La altura es obligatoria";
            } else if (values.altura < 0.50 || values.altura > 2.50) {
                errors.altura = "La altura debe estar entre 0.50 m y 2.50 m";
            }

            if (!values.edad) {
                errors.edad = "La edad es obligatoria";
            } else if (values.edad < 12 || values.edad > 100) {
                errors.edad = "La edad debe ser entre los 12 años y 100 años";
            }

            if (!values.genero) errors.genero = "El género es obligatorio";

            return errors;
        },
    });

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Registro Físico</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Peso (kg)</label>
                    <input
                        type="number"
                        name="peso"
                        value={formik.values.peso}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.errors.peso && <p className="text-red-500 text-sm mt-1">{formik.errors.peso}</p>}
                </div>
    
                <div>
                    <label className="block text-gray-700 font-medium">Altura (m)</label>
                    <input
                        type="number"
                        name="altura"
                        value={formik.values.altura}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.errors.altura && <p className="text-red-500 text-sm mt-1">{formik.errors.altura}</p>}
                </div>
    
                <div>
                    <label className="block text-gray-700 font-medium">Edad</label>
                    <input
                        type="number"
                        name="edad"
                        value={formik.values.edad}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.errors.edad && <p className="text-red-500 text-sm mt-1">{formik.errors.edad}</p>}
                </div>
    
                <div>
                    <label className="block text-gray-700 font-medium">Género</label>
                    <select
                        name="genero"
                        value={formik.values.genero}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                    {formik.errors.genero && <p className="text-red-500 text-sm mt-1">{formik.errors.genero}</p>}
                </div>
    
                <div>
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
    
};

export default PhysicalFormView;
