'use client';

import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function ContactPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
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
    <div className="min-h-screen flex items-center justify-center p-6 font-sora">
      <motion.div 
        className="w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-[#6b8f71] p-8 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Contáctanos
            </motion.h2>
            <motion.p 
              className="text-[#e7e3d8] text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Estamos aquí para ayudarte en tu viaje hacia una vida más saludable
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <motion.div 
              className="grid md:grid-cols-2 gap-12"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Contact Info */}
              <motion.div variants={fadeIn}>
                <h3 className="text-2xl font-semibold text-[#5a5f52] mb-6">Información de contacto</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-[#6b8f71] mr-4 mt-1">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5a5f52]">Correo electrónico</h4>
                      <a 
                        href="mailto:nutriflowhenry@gmail.com" 
                        className="text-gray-600 hover:text-[#6b8f71] transition-colors select-all"
                      >
                        nutriflowhenry@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-[#6b8f71] mr-4 mt-1">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5a5f52]">Ubicación</h4>
                      <p className="text-gray-600">Remoto - Equipo distribuido</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-[#6b8f71] mr-4 mt-1">
                      <FaPhone className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5a5f52]">Soporte</h4>
                      <p className="text-gray-600">Disponible por correo electrónico</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Email Button */}
              <motion.div 
                className="flex flex-col items-center justify-center"
                variants={fadeIn}
              >
                <div className="bg-[#f4f1eb] p-8 rounded-xl w-full text-center">
                  <FaPaperPlane className="text-5xl text-[#6b8f71] mx-auto mb-6" />
                  <p className="text-gray-700 mb-6">
                    ¿Tienes preguntas, sugerencias o necesitas ayuda? Envíanos un mensaje y te responderemos lo antes posible.
                  </p>
                  <a
                    href="mailto:nutriflowhenry@gmail.com"
                    className="bg-gradient-to-r from-[#6b8f71] to-[#7f9c91] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:opacity-90 transition-all duration-300 inline-flex items-center"
                  >
                    <FaPaperPlane className="mr-2" />
                    Enviar correo
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p 
          className="text-center text-gray-700 mt-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Generalmente respondemos dentro de las 24-48 horas
        </motion.p>
      </motion.div>
    </div>
  );
}