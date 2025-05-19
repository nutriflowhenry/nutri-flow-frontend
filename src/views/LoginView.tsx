'use client'
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/helpers/auth.helper";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

const LoginView = () => {
  const { setUserData, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // Esquema validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Correo inválido")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria")
  });

  return (
    <div className="flex justify-center items-center mt-6 mb-5">
      <div className="w-full md:max-w-md max-w-[350px] bg-gradient-to-br from-[#D3D4C4] to-[#B3B19C] p-6 rounded-[25px] shadow-[-20px_-20px_60px_#FFFFFF,10px_10px_30px_#778474] relative flex flex-col items-center">
        <h2 className="text-[24px] font-semibold text-center text-[#444B3B] tracking-[0.005em]">Iniciar Sesión</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const response = await login(values);
              const { token, user } = response;
              setUserData({ token, user });

              await Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                text: "Bienvenido de nuevo!",
              });
              // Verificar si es administrador
              if (user.role === 'admin') {
                return router.push("/dashboard/admin");
              }

              if (user.userProfile !== null) {
                return router.push("/home");
              }


            } catch (error) {
              if (error instanceof Error) {
                if (error.message === "Tu cuenta está inactiva. Por favor, contacta al soporte.") {
                  await Swal.fire({
                    icon: "error",
                    title: "Cuenta inactiva",
                    text: error.message,
                  });
                } else {
                  await Swal.fire({
                    icon: "error",
                    title: "Error de inicio de sesión",
                    text: error.message,
                  });
                }
              } else {
                await Swal.fire({
                  icon: "error",
                  title: "Error de inicio de sesión",
                  text: "Ocurrió un error desconocido.",
                });
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="w-full md:max-w-[350px] space-y-4 md:space-y-6">
              <div className="flex flex-col">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email:</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                />
                <ErrorMessage name="email" component="span" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex flex-col relative">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">Contraseña:</label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="*******"
                    className="w-full h-[42px] bg-white shadow-[inset_2px_2px_7px_#000000] rounded-[25px] p-2 pl-4 text-[#313131] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage name="password" component="span" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex items-center justify-center my-2">
                <div className="flex-grow border-t-2 border-gray-500"></div>
              </div>
              <div className='flex ml-5 mt-5'>
                <div className="relative flex justify-center items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-[144px] left-[116px] bg-[#f78707] text-white py-2 px-4 rounded-xl disabled:opacity-50 transition-transform transform hover:scale-110"
                  >
                    {isSubmitting ? "Ingresando..." : "Ingresar"}
                  </button>
                </div>
                
                <button
                  className="flex items-center justify-center w-full h-[42px] transition-transform transform hover:scale-125"
                  onClick={loginWithGoogle}
                >
                  <FaGoogle className="text-white-500 md:text-[44px]" /> oogle
                </button>

              </div>
              <p className="text-xs text-center text-gray-500">
                ¿No tienes una cuenta?{' '}
                <a href="/register" className="font-medium text-[#eaefe4] hover:underline">
                  Registrate aquí
                </a>
              </p>
            </Form>
          )}
        </Formik>


      </div>
    </div>
  );
};

export default LoginView;