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
      <div className="w-full max-w-md bg-[#c4c1a4] p-8 rounded-2xl shadow-lg relative flex flex-col items-center pb-11" style={{ boxShadow: '8px 8px 16px #a29f8e, -8px -8px 16px #e6e3d2' }}>
        <h2 className="text-xl font-bold text-gray-700 mb-6">Iniciar Sesión</h2>

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
            <Form className="space-y-4 w-full">
              <div className="flex flex-col">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email:</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  className="p-2  text-gray-700 rounded-xl border-none w-full shadow-inner bg-[#e6e3d2] focus:outline-none"
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
                    className="text-black p-2 rounded-xl border-none w-full shadow-inner bg-[#e6e3d2] focus:outline-none pr-10"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="w-full h-px bg-gray-400 my-4" >
          
          <div className="flex justify-center space-x-6">
            <button
              className="flex items-center justify-center w-full bg-white text-gray-700 hover:shadow-lg py-2 px-4 rounded-xl transition-transform transform hover:scale-105"
              onClick={loginWithGoogle}
            >
              <FaGoogle className="text-red-500 text-xl mr-2" />
              <span className="font-medium">Ingresar con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;