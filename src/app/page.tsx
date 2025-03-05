"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f4f1eb] flex flex-col items-center justify-center p-6 font-sora">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-[#5a5f52] mb-6 drop-shadow-md">¡Bienvenido!</h1>
        <p className="text-[#f4f1eb] bg-[#a7b8a8] p-5 rounded-2xl shadow-lg">
          Descubrí una forma simple y armoniosa de llevar el seguimiento de tu alimentación. Registra tus comidas, visualiza tu progreso y desarrolla hábitos saludables con una interfaz minimalista y relajante diseñada para tu bienestar.
        </p>
        <div className="mt-8 p-6 bg-[#e7e3d8] rounded-2xl shadow-lg">
          <p className="text-[#5a5f52] mb-4 text-lg font-semibold">¿Todavía no te registraste?</p>
          <button 
            onClick={() => router.push("/register")}
            className="w-full bg-[#6b8f71] text-white py-3 rounded-xl hover:bg-[#5a7c62] transition mb-4 shadow-md"
          >
            Registrarse
          </button>
          <p className="text-[#5a5f52] mb-2 text-lg font-semibold">Si ya estás registrado,</p>
          <button 
            onClick={() => router.push("/login")}
            className="w-full bg-[#7f9c91] text-white py-3 rounded-xl hover:bg-[#6d8a80] transition shadow-md"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
