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

        <div className="flex justify-center items-center mb-12 mt-12">
            <div className="w-full max-w-md bg-[#c4c1a4] p-8 rounded-2xl shadow-lg relative flex flex-col items-center" style={{ boxShadow: '8px 8px 16px #a29f8e, -8px -8px 16px #e6e3d2' }}>
                <h2 className="text-xl font-bold text-gray-700 mb-6">Registro</h2>

                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        passwordConfirmation: '',
                    }}

                    onSubmit={async (values, { setSubmitting}) => {
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

                        <Form className="space-y-4 md:space-y-6">

                            <div className="flex flex-col">
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Nombre</label>
                                <Field type="text" name="name" id="name" className="p-2  text-gray-700 rounded-xl border-none w-full shadow-inner bg-[#e6e3d2] focus:outline-none" placeholder="Jhon" required="" />
                                {errors.name && touched.name && (
                                    <Alert type="error" message={errors.name} />
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                                <Field type="email" name="email" id="email" className="p-2  text-gray-700 rounded-xl border-none w-full shadow-inner bg-[#e6e3d2] focus:outline-none" placeholder="Jhon@gmail.com" required="" />
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
                                        className="p-2 text-gray-700 rounded-xl border-none w-full shadow-inner bg-[#e6e3d2] focus:outline-none pr-10"
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
                                        className="p-2 text-gray-700 rounded-xl border-none w-full shadow-inner bg-[#e6e3d2] focus:outline-none pr-10"
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

                            <button disabled={!isValid} type="submit" className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-xl disabled:opacity-50">Registrarse</button>
                            <div className="flex justify-center">or</div>
                            <div className="w-full h-px my-4" >
                                <div className="flex justify-center space-x-6">
                                    <button type="button" className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 shadow-md hover:shadow-lg py-2 px-4 rounded-xl transition-transform transform hover:scale-105" onClick={loginWithGoogle}>
                                        <FaGoogle className="text-red-500 text-xl mr-2" />
                                        Registrarse con Google
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account? <a href="/login" className="font-medium text-amring-amber-700 hover:underline">Login here</a>
                            </p>

                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    )
}

export default RegisterView;