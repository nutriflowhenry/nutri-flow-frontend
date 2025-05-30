'use client';
import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { IUserProfile } from '@/types';
import { fetchUserProfile } from '@/helpers/auth.helper';
import { createProfile } from '@/helpers/profile.helper';
import { physicalFormValidationSchema } from '@/helpers/validationSchemas'; // Importar el esquema

// Interfaz para el formulario
export interface IPhysicalForm {
    weight: number | string;
    height: number | string;
    birthdate: Date | string;
    gender: string;
    activityLevel: 'sedentary' | 'moderate' | 'active' | 'very active';
    weightGoal: 'lose weight' | 'maintain' | 'gain muscle';
}

const PhysicalFormView = () => {
    const { userData, setUserData } = useContext(AuthContext);
    const router = useRouter();

    const formik = useFormik<IPhysicalForm>({
        initialValues: {
            weight: 60,
            height: 1.65,
            birthdate: '1996-01-01',
            gender: '',
            activityLevel: 'moderate',
            weightGoal: 'maintain',
        },
        validationSchema: physicalFormValidationSchema, // esquema importado
        onSubmit: async (values) => {
            if (!userData) {
                console.error("Usuario no autenticado.");
                return;
            }

            // Convertir weight y height a number si son strings
            const weight = typeof values.weight === 'string' ? parseFloat(values.weight) : values.weight;
            const height = typeof values.height === 'string' ? parseFloat(values.height) : values.height;

            // Convertir birthdate a string si es un objeto Date
            const birthdate = values.birthdate instanceof Date ? values.birthdate.toISOString().split('T')[0] : values.birthdate;

            // Traducir los valores del formulario al formato esperado por el backend
            const translatedValues = {
                weight: weight,
                height: height,
                birthdate: birthdate,
                gender: values.gender === "masculino" ? "male" : values.gender === "femenino" ? "female" : "other",
                activityLevel: values.activityLevel,
                weightGoal: values.weightGoal,
            };

            try {
                // Crear el perfil del usuario
                await createProfile(userData.token, translatedValues);

                // Obtener y actualizar el perfil del usuario
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
                            userProfile: profileData,
                        },
                    });
                }

                router.push("/home");
            } catch (error) {
                console.error("Error al crear el perfil:", error);
            }
        },
    });

    return (
        <div className="flex flex-col min-h-[calc(80vh-20px)] md:min-h-[calc(100vh-60px)] justify-center">
            <div className="flex justify-center items-center mt-6 mb-6">
                <div className="w-full md:max-w-sm max-w-[350px] bg-gradient-to-br from-[#D3D4C4] to-[#B3B19C] p-6 rounded-[25px] shadow-[-20px_-20px_60px_#FFFFFF,10px_10px_30px_#778474] relative flex flex-col items-center">
                    <h2 className="text-[24px] font-semibold text-center text-[#444B3B] tracking-[0.005em]">Registro Físico</h2>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Campo: Peso */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Peso (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                            />
                            {formik.touched.weight && formik.errors.weight && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.weight}</p>
                            )}
                        </div>

                        {/* Campo: Altura */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Altura (m)</label>
                            <input
                                type="number"
                                name="height"
                                value={formik.values.height}
                                step="0.01"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                            />
                            {formik.touched.height && formik.errors.height && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.height}</p>
                            )}
                        </div>

                        {/* Campo: Fecha de Cumpleaños */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="birthdate"
                                value={formik.values.birthdate instanceof Date ? formik.values.birthdate.toISOString().split('T')[0] : formik.values.birthdate }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                            />
                            {formik.touched.birthdate && formik.errors.birthdate && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.birthdate}</p>
                            )}
                        </div>

                        {/* Campo: Género */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Género</label>
                            <select
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                            >
                                <option value="">Seleccionar</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                            {formik.touched.gender && formik.errors.gender && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
                            )}
                        </div>

                        {/* Campo: Nivel de Actividad */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Nivel de Actividad</label>
                            <select
                                name="activityLevel"
                                value={formik.values.activityLevel}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                            >
                                <option value="sedentary">Sedentario</option>
                                <option value="moderate">Moderado</option>
                                <option value="active">Activo</option>
                                <option value="very active">Muy Activo</option>
                            </select>
                            {formik.touched.activityLevel && formik.errors.activityLevel && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.activityLevel}</p>
                            )}
                        </div>

                        {/* Campo: Objetivo de Peso */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Objetivo de Peso</label>
                            <select
                                name="weightGoal"
                                value={formik.values.weightGoal}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                            >
                                <option value="lose weight">Perder Peso</option>
                                <option value="maintain">Mantener Peso</option>
                                <option value="gain muscle">Ganar Músculo</option>
                            </select>
                            {formik.touched.weightGoal && formik.errors.weightGoal && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.weightGoal}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-[#f78707] text-white py-2 rounded-xl transition duration-300"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PhysicalFormView;