'use client';

import React from 'react';
import { Bars3Icon, LightBulbIcon, UserIcon } from '@heroicons/react/24/outline';
import Logo from '@/assets/Logo';
import Wave from '@/assets/Wave';

const Navbar: React.FC = () => {
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

        
        <div className="flex items-center">
          <button aria-label="User profile">
            <UserIcon className="w-6 h-6 text-gray-700" />
          </button>
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