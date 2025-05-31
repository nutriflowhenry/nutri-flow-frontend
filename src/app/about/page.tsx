'use client';

import { motion } from 'framer-motion';
import { FaLeaf, FaHeartbeat, FaWater, FaLaptopCode, FaServer, FaChartLine} from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { GiMeal } from 'react-icons/gi';
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  };

  const slideIn = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const teamMembers = [
    {
      name: "Ornela Zanella",
      role: "Front-End",
      icon: <FaLaptopCode />,
      github: "https://github.com/ZanellaOrnela"
    },
    {
      name: "Augusto Velazquez",
      role: "Front-End",
      icon: <FaLaptopCode />,
      github: "https://github.com/salvavelazquez"
    },
    {
      name: "Omar Águila",
      role: "Back-End",
      icon: <FaServer />,
      github: "https://github.com/OAguilaLira"
    },
    {
      name: "Karen Casallas",
      role: "Front-End",
      icon: <FaLaptopCode />,
      github: "https://github.com/KarenCasallas"
    },
    {
      name: "Renzo Jiménez",
      role: "Back-End",
      icon: <FaServer />,
      github: "https://github.com/RenzoJimenezB"
    },
    {
      name: "Marcos Murphy",
      role: "Front-End",
      icon: <FaLaptopCode />,
      github: "https://github.com/marcosmur"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] font-sora">
      {/* Hero Section */}
      <motion.section
        className="relative py-24 px-6 flex items-center justify-center bg-[#5a5f52] text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Sobre Nosotros
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Somos un equipo apasionado de desarrolladores formados en Soy Henry, comprometidos con tu bienestar a través de la tecnología.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-24 h-1 bg-[#9BA783] rounded-full"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={slideIn}>
              <h2 className="text-4xl font-bold text-[#5a5f52] mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-700 mb-6">
                Transformar la manera en que las personas interactúan con su salud nutricional, haciendo el seguimiento de hábitos saludables algo intuitivo, accesible y motivador.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-[#6b8f71] mr-4 mt-1">
                    <FaLeaf className="text-xl" />
                  </div>
                  <p className="text-gray-700">Enfoque holístico del bienestar</p>
                </div>
                <div className="flex items-start">
                  <div className="text-[#6b8f71] mr-4 mt-1">
                    <FaHeartbeat className="text-xl" />
                  </div>
                  <p className="text-gray-700">Tecnología al servicio de la salud</p>
                </div>
                <div className="flex items-start">
                  <div className="text-[#6b8f71] mr-4 mt-1">
                    <IoIosPeople className="text-xl" />
                  </div>
                  <p className="text-gray-700">Comunidad de apoyo mutuo</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-[#f4f1eb] p-8 rounded-2xl shadow-sm border border-[#e7e3d8]"
            >
              <h3 className="text-2xl font-semibold text-[#5a5f52] mb-4">El Proyecto</h3>
              <p className="text-gray-700 mb-6">
                Como proyecto final de nuestro bootcamp, hemos creado esta plataforma que combina lo mejor de la nutrición con tecnología accesible.
              </p>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <span className="inline-block w-2 h-2 bg-[#6b8f71] rounded-full mr-2"></span>
                  Contador inteligente de calorías
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="inline-block w-2 h-2 bg-[#6b8f71] rounded-full mr-2"></span>
                  Seguimiento de hidratación personalizado
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="inline-block w-2 h-2 bg-[#6b8f71] rounded-full mr-2"></span>
                  Diario de comidas con recetas saludables
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#5a5f52] mb-4">Lo Que Ofrecemos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas diseñadas para empoderarte en tu viaje hacia una vida más saludable
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl text-[#6b8f71] mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold text-[#5a5f52] mb-3">Seguimiento Nutricional</h3>
              <p className="text-gray-600">
                Registra y analiza tus hábitos alimenticios con nuestro sistema inteligente.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl text-[#6b8f71] mb-4">
                <FaWater />
              </div>
              <h3 className="text-xl font-semibold text-[#5a5f52] mb-3">Control de Hidratación</h3>
              <p className="text-gray-600">
                Programa recordatorios y lleva un registro preciso de tu consumo diario de agua basado en tus necesidades.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl text-[#6b8f71] mb-4">
                <GiMeal />
              </div>
              <h3 className="text-xl font-semibold text-[#5a5f52] mb-3">Recetas Saludables</h3>
              <p className="text-gray-600">
                Descubre nuevas recetas adaptadas a tus objetivos nutricionales y comparte tus creaciones.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#5a5f52] mb-4">Conoce al Equipo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              El talentoso grupo de desarrolladores detrás de este proyecto
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {teamMembers.map((member) => (
              <motion.a
                key={member.name}
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeIn}
                className="block bg-[#f8f9fa] p-6 rounded-xl text-center transition-all hover:bg-[#f1f3f5] cursor-pointer group"
                whileHover={{ y: -5 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#6b8f71] text-white text-2xl flex items-center justify-center">
                  {member.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#5a5f52] group-hover:text-[#6b8f71] transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
                <div className="mt-3">
                  <span className="inline-block w-8 h-0.5 bg-[#6b8f71]"></span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#5a5f52] to-[#6b8f71] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            ¿Listo para comenzar tu transformación?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Únete a nuestra comunidad y descubre cómo pequeños cambios pueden generar grandes resultados.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => router.push("/register")}
              className="bg-white text-[#5a5f52] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg"
            >
              Comenzar Ahora
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-gray-700 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          &copy; {new Date().getFullYear()} Wellness Tracker | Proyecto Final Soy Henry
        </motion.p>
      </footer>
    </div>
  );
}