'use client';

import React from 'react';
import { Bars3Icon, LightBulbIcon, UserIcon } from '@heroicons/react/24/outline';
import Logo from '@/assets/Logo';
import Wave from '@/assets/Wave';

const Navbar: React.FC = () => {
  return (
    <div className="relative w-full">
      {/* Contenedor de la navbar */}
      <nav className="bg-[#F4EAE0] w-full h-[60px] flex items-center justify-between px-4 relative z-20">
        {/* Sección izquierda (menú y toggle light mode) */}
        <div className="flex items-center space-x-3">
          <button aria-label="Open menu">
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
          <button aria-label="Toggle light mode">
            <LightBulbIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Sección central (logo) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[40px] z-30" style={{ width: '76px', height: '63px' }}>
          <Logo />
        </div>

        {/* Sección derecha (icono de usuario) */}
        <div className="flex items-center">
          <button aria-label="User profile">
            <UserIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Onda integrada usando un pseudo-elemento */}
      <style jsx>{`
        .navbar-wave::after {
          content: '';
          position: absolute;
          bottom: -20px; /* Ajusta la posición para que se solape */
          left: 0;
          width: 100%;
          height: 20px; /* Altura de la onda */
          background: #F4EAE0; /* Color de fondo */
          clip-path: url(#wave-path); /* Referencia al path definido en el SVG */
          z-index: 10;
        }
      `}</style>
      <div className="navbar-wave"></div>

      {/* SVG oculto con la definición del path */}
      <Wave />
    </div>
  );
};

export default Navbar;