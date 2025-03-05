'use client';

import React, { useState, useEffect } from 'react';
import { Bars3Icon, LightBulbIcon, UserIcon } from '@heroicons/react/24/outline';
import Logo from '@/assets/Logo';
import Wave from '@/assets/Wave';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(Cookies.get('token'));

  useEffect(() => {
    // Escuchar cambios en las cookies. Si el token cambia, se actualiza el estado
    const handleStorageChange = () => {
      setToken(Cookies.get('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    // Limpiar el listener cuando el componente se desmonte
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    // Eliminar el token de las cookies y actualizar el estado
    Cookies.remove('token');
    setToken(undefined);
    router.push('/login');
  };

  return (
    <div className="relative w-full">
      <nav className="bg-[#F4EAE0] w-full h-[60px] flex items-center justify-between px-4 relative z-20">
        <div className="flex items-center space-x-3">
          <button aria-label="Open menu">
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
          <button aria-label="Toggle light mode">
            <LightBulbIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[40px] z-30" style={{ width: '76px', height: '63px' }}>
          <Logo />
        </div>

        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <button aria-label="User profile">
                <UserIcon className="w-6 h-6 text-gray-700" />
              </button>
              <button onClick={handleLogout} className="text-gray-700">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/login')} className="text-gray-700">Iniciar Sesión</button>
              <button onClick={() => router.push('/register')} className="text-gray-700">Registrarse</button>
            </>
          )}
        </div>
      </nav>

      <style jsx>{`
        .navbar-wave::after {
          content: '';
          position: absolute;
          bottom: -20px; 
          left: 0;
          width: 100%;
          height: 20px; 
          background: #F4EAE0; 
          clip-path: url(#wave-path); 
          z-index: 10;
        }
      `}</style>
      <div className="navbar-wave"></div>

      <Wave />
    </div>
  );
};

export default Navbar;
