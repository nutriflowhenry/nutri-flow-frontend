import React from 'react';
import Logo_Secundario from '@/assets/Logo_Secundario';

const Footer = () => {
  return (
    <footer className="relative bg-[#B5A488] rounded-t-3xl px-2 py-3 overflow-hidden">
      {/* Inner shadow efecto */}
      <div className="absolute inset-0 rounded-t-3xl shadow-[inset_8px_8px_15px_rgba(0,0,0,0.25)]"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-row md:flex-row justify-between items-center">
          <div className=" md:mb-0 ">
            <Logo_Secundario  />
          </div>
          <div className="flex flex-row p-3 space-x-5">
            <a href="/contact" className="hover:text-gray-300 text-[#242424] font-semibold text-xs font-sora transition-colors duration-300">Contacto</a>
            <a href="/blog" className="hover:text-gray-300 text-[#242424] font-semibold text-xs font-sora transition-colors duration-300">Blog</a>
            <a href="/about" className="hover:text-gray-300 text-[#242424] font-semibold text-xs font-sora transition-colors duration-300">About</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
