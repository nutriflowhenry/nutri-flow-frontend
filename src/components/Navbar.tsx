"use client";

import React, { useState } from "react";
import {
  UserCircleIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/assets/Logo";
import Wave from "@/assets/Wave";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


const LoadingModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-4 text-gray-700">Cargando...</p>
      </div>
    </div>
  );
};

const Navbar = () => {
  const router = useRouter();
  const { userData, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      {isLoading && <LoadingModal />}
      <nav className="bg-[#F4EAE0] w-full h-[60px] flex items-center justify-between px-4 relative z-20">
        <div className="flex items-center space-x-3">
          {/* <button aria-label="Open menu">
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
          <button aria-label="Toggle light mode">
            <LightBulbIcon className="w-6 h-6 text-gray-700" />
          </button> */}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[40px] z-30" style={{ width: '76px', height: '63px' }}>
          <Logo />
        </div>

        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {userData ? (
                <>
                  <button
                    onClick={() => router.push("/home")}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                    disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                  >
                    Mi Bienestar
                  </button>
                  <button
                    onClick={() => router.push("/blog")}
                    className="hidden md:inline-block text-gray-700 hover:text-gray-900 transition-colors"
                    disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                  >
                    Blog
                  </button>
                  {userData?.user?.subscriptionType === "premium" && (
                    <button
                      onClick={() => router.push("/chatbot")}
                      className="hidden md:inline-block text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Chatbot
                    </button>
                  )}
                  <div
                    className="relative"
                    onMouseEnter={handleMenuOpen}
                    onMouseLeave={handleMenuClose}
                  >

                    <button
                      aria-label="User profile"
                      className="md:px-4 py-2"
                      onClick={() => router.push('/dashboard')}
                      disabled={userData.user.userProfile === null}
                    >
                      <UserIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 w-48 bg-white rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => {
                            if (userData.user.role !== "admin") {
                              router.push('/dashboard');
                            } else {
                              router.push('/dashboard/admin');
                            }
                          }}
                          className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                          disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                        >
                          Mi Perfil
                        </button>
                        <button
                          onClick={() => router.push("/blog")}
                          className="md:hidden block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                          disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                        >
                          Blog
                        </button>
                        {userData?.user?.subscriptionType === "premium" && (
                          <button
                            onClick={() => router.push("/chatbot")}
                            className="md:hidden block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                            disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                          >
                            ChatBot
                          </button>
                        )}
                        <button
                          onClick={() => router.push("/dashboard/userSetting")}
                          className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                          disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                        >
                          Ajustes
                        </button>
                        <button
                          onClick={logout}
                          className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden sm:flex space-x-4">
                    <button onClick={() => router.push('/login')} className="text-gray-700">Iniciar Sesión </button>
                    <button onClick={() => router.push('/register')} className="text-gray-700">| Registrarse</button>
                  </div>
                  <div className="sm:hidden flex space-x-8">
                    <button onClick={() => router.push('/login')} aria-label="Login">
                      <UserCircleIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <button onClick={() => router.push('/register')} aria-label="Register">
                      <UserPlusIcon className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                </>
              )}
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
