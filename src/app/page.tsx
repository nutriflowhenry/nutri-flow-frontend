"use client";
import { useRouter } from "next/navigation";
import { FaChartLine, FaAppleAlt, FaHeartbeat, FaArrowRight } from 'react-icons/fa';
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EAE0] font-sora">
      {/* Hero Section */}
      <motion.div 
        className="min-h-[80vh] flex items-center justify-center p-6 pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl text-center">
          <motion.h1 
            className="text-6xl font-bold text-[#5a5f52] mb-8 drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ¡Bienvenido a NutriFlow!
          </motion.h1>
          <motion.p 
            className="text-[#f4f1eb] bg-[#a7b8a8] p-8 rounded-2xl shadow-lg text-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Descubrí una forma simple y armoniosa de llevar el seguimiento de tu alimentación. Registra tus comidas, visualiza tu progreso y desarrolla hábitos saludables con una interfaz minimalista y relajante diseñada para tu bienestar.
          </motion.p>
          <motion.div 
            className="mt-12 p-8 bg-[#e7e3d8] rounded-2xl shadow-lg max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-[#5a5f52] mb-4 text-xl font-semibold">¿Todavía no te registraste?</p>
            <button 
              onClick={() => router.push("/register")}
              className="w-full bg-[#6b8f71] text-white py-4 rounded-xl hover:bg-[#5a7c62] transition mb-4 shadow-md text-lg"
            >
              Registrarse
            </button>
            <p className="text-[#5a5f52] mb-2 text-xl font-semibold">Si ya estás registrado,</p>
            <button 
              onClick={() => router.push("/login")}
              className="w-full bg-[#7f9c91] text-white py-4 rounded-xl hover:bg-[#6d8a80] transition shadow-md text-lg"
            >
              Iniciar Sesión
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="py-20 bg-[#e7e3d8]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-[#5a5f52] text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Características Principales
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg text-center"
              variants={fadeInUp}
            >
              <FaChartLine className="text-4xl text-[#6b8f71] mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-[#5a5f52] mb-4">Seguimiento Personalizado</h3>
              <p className="text-[#5a5f52]">Monitorea tu progreso con gráficos detallados y análisis personalizados de tu alimentación.</p>
            </motion.div>
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg text-center"
              variants={fadeInUp}
            >
              <FaAppleAlt className="text-4xl text-[#6b8f71] mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-[#5a5f52] mb-4">Base de Datos Nutricional</h3>
              <p className="text-[#5a5f52]">Accede a una extensa base de datos de alimentos con información nutricional detallada.</p>
            </motion.div>
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg text-center"
              variants={fadeInUp}
            >
              <FaHeartbeat className="text-4xl text-[#6b8f71] mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-[#5a5f52] mb-4">Salud Integral</h3>
              <p className="text-[#5a5f52]">Recibe recomendaciones personalizadas para mejorar tu salud y bienestar general.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="py-20 bg-[#F4EAE0]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <h3 className="text-5xl font-bold text-[#6b8f71] mb-2">10K+</h3>
              <p className="text-xl text-[#5a5f52]">Usuarios Activos</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h3 className="text-5xl font-bold text-[#6b8f71] mb-2">50K+</h3>
              <p className="text-xl text-[#5a5f52]">Comidas Registradas</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h3 className="text-5xl font-bold text-[#6b8f71] mb-2">95%</h3>
              <p className="text-xl text-[#5a5f52]">Satisfacción</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        className="py-20 bg-[#e7e3d8]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-[#5a5f52] text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Lo que dicen nuestros usuarios
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg"
              variants={fadeInUp}
            >
              <p className="text-[#5a5f52] italic mb-4">&ldquo;NutriFlow ha transformado mi relación con la comida. Ahora tengo un mejor control de mi alimentación y me siento más saludable que nunca.&rdquo;</p>
              <p className="font-semibold text-[#6b8f71]">- María González</p>
            </motion.div>
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg"
              variants={fadeInUp}
            >
              <p className="text-[#5a5f52] italic mb-4">&ldquo;La interfaz es intuitiva y fácil de usar. Me encanta poder ver mi progreso y recibir recomendaciones personalizadas.&rdquo;</p>
              <p className="font-semibold text-[#6b8f71]">- Juan Pérez</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="py-20 bg-[#F4EAE0]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="bg-gradient-to-r from-[#6b8f71] to-[#7f9c91] rounded-3xl p-12 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <motion.h2 
                className="text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                ¿Listo para comenzar tu viaje hacia una vida más saludable?
              </motion.h2>
              <motion.p 
                className="text-white text-lg mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Únete a miles de personas que ya están transformando sus vidas con NutriFlow. Comienza tu viaje hacia una alimentación más saludable hoy mismo.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button 
                  onClick={() => router.push("/register")}
                  className="bg-white text-[#6b8f71] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#f4f1eb] transition-all duration-300 flex items-center gap-2 mx-auto group"
                >
                  Comenzar Ahora
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
