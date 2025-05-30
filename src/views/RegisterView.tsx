'use client'
import { Formik, Field, Form } from 'formik';
import { validateRegisterForm } from '@/helpers/validate';
import { register } from '@/helpers/auth.helper';
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from "sweetalert2";
import { useState } from 'react';

const RegisterView = () => {
    const router = useRouter();
    const { loginWithGoogle } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex flex-col min-h-[calc(80vh-20px)] md:min-h-[calc(100vh-60px)] justify-center">
            <div className="flex justify-center items-center mt-6 mb-6">
                <div className="w-full md:max-w-md max-w-[350px] bg-gradient-to-br from-[#D3D4C4] to-[#B3B19C] p-6 rounded-[25px] shadow-[-20px_-20px_60px_#FFFFFF,10px_10px_30px_#778474] relative flex flex-col items-center">
                    <h2 className="text-[24px] font-semibold text-center text-[#444B3B] tracking-[0.005em]">Registro</h2>
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            password: '',
                            passwordConfirmation: '',
                        }}

                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                await register(values);
                                await Swal.fire({
                                    icon: "success",
                                    title: "Registro exitoso",
                                    text: "Ahora puedes iniciar sesión",
                                });
                                router.push('/login');
                            } catch (error) {
                                let errorMessage = "Credenciales incorrectas o error en el servidor.";

                                // Verificar si es un Error estándar
                                if (error instanceof Error) {
                                    errorMessage = error.message;
                                }
                                // Verificar si es una respuesta de error de la API
                                else if (typeof error === 'object' && error !== null && 'message' in error) {
                                    errorMessage = (error as { message: string }).message;
                                }

                                await Swal.fire({
                                    icon: "error",
                                    title: "Error en el registro",
                                    text: errorMessage,
                                });
                            } finally {
                                setSubmitting(false);
                            }
                        }}

                        validate={validateRegisterForm}
                    >
                        {({ errors, touched, isValid }) => (

                            <Form className="w-full md:max-w-[350px] space-y-4 md:space-y-3">

                                <div className="flex flex-col">
                                    <label htmlFor="name" className="block text-lg font-medium text-gray-700">Nombre</label>
                                    <Field type="text" name="name" id="name" className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none" placeholder="Jhon" required="" />
                                    {errors.name && touched.name && (
                                        <Alert type="error" message={errors.name} />
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                                    <Field type="email" name="email" id="email" className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none" placeholder="Jhon@gmail.com" required="" />
                                    {errors.email && touched.email && (
                                        <Alert type="error" message={errors.email} />
                                    )}
                                </div>

                                <div className="relative">
                                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Contraseña</label>
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                                            placeholder="********"
                                            required=""
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <Alert type="error" message={errors.password} />
                                    )}
                                </div>

                                <div className="relative">
                                    <label htmlFor="passwordConfirmation" className="block text-lg font-medium text-gray-700">Confirmar Contraseña</label>
                                    <div className="relative">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="passwordConfirmation"
                                            id="passwordConfirmation"
                                            className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                                            placeholder="********"
                                            required=""
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.passwordConfirmation && touched.passwordConfirmation && (
                                        <Alert type="error" message={errors.passwordConfirmation} />
                                    )}
                                </div>

                                <div className="flex items-center justify-center my-2">
                                    <div className="flex-grow border-t-2 border-gray-500"></div>
                                </div>

                                <div className='flex ml-5 mt-5'>

                                    <div className="relative flex justify-center items-center">
                                        <button disabled={!isValid} type="submit" className="w-[144px] left-[116px] bg-[#f78707] text-white py-2 px-4 rounded-xl disabled:opacity-50 transition-transform transform hover:scale-110">Registrarme</button>
                                    </div>
                                    <button type="button" className="flex items-center justify-center w-full h-[42px] transition-transform transform hover:scale-125 " onClick={loginWithGoogle}>
                                        <FaGoogle className="text-white-500 md:text-[44px] " /> oogle
                                    </button>

                                </div>

                                <p className="text-xs text-center text-gray-500">
                                    ¿Ya tienes una cuenta?{' '}
                                    <a href="/login" className="font-medium text-[#eaefe4] hover:underline">
                                        Inicia sesión aquí
                                    </a>
                                </p>

                            </Form>
                        )}

                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default RegisterView;