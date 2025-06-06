"use client";

import React, { useState } from "react";

import {
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { FaUser, FaSignOutAlt, FaCog, FaHome, FaBlog, FaRobot } from "react-icons/fa";
import Logo from "@/assets/Logo";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SideBar from "./SideBar";
import Link from "next/link";
import { motion } from "framer-motion";


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
  const pathname = usePathname();

  const isAdminDashboard = userData?.user?.role === "admin" && pathname.startsWith("/dashboard/admin");

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Definición del SVG de la wave al inicio */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="wave-path" clipPathUnits="objectBoundingBox">
            <path
              d="M0 0H1V0.5C1 0.5 0.845 0 0.747 0.1C0.647 0.2 0.6 0.5 0.5 0.5C0.397 0.5 0.35 0.2 0.247 0.1C0.15 0 0 0.5 0 0.5V0Z"
              style={{
                filter: "drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </clipPath>
        </defs>
      </svg>

      {isLoading && <LoadingModal />}

      {isAdminDashboard && <SideBar />}

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
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>

        <div className="flex items-center space-x-4 md:mr-5">
          {!isLoading && !isAdminDashboard && (
            <>
              {userData ? (
                <>
                  <motion.button
                    onClick={() => {
                      const redirectTo = "/home";
                      router.push(redirectTo);
                    }}
                    className="text-[#5a5f52] hover:text-[#6b8f71] transition-colors font-sora font-medium text-sm md:text-base"
                    disabled={userData.user.userProfile === null && userData.user.role == "admin"}
                    whileHover={{ scale: 1.05 }}
                  >
                    Mi Bienestar
                  </motion.button>
                  <motion.button
                    onClick={() => router.push("/blog")}
                    className="hidden md:inline-block text-[#5a5f52] hover:text-[#6b8f71] transition-colors font-sora font-medium text-sm md:text-base"
                    disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                    whileHover={{ scale: 1.05 }}
                  >
                    Blog
                  </motion.button>
                  {userData?.user?.subscriptionType === "premium" && (
                    <motion.button
                      onClick={() => router.push("/chatbot")}
                      className="hidden md:inline-block text-[#5a5f52] hover:text-[#6b8f71] transition-colors font-sora font-medium text-sm md:text-base"
                      whileHover={{ scale: 1.05 }}
                    >
                      Chatbot
                    </motion.button>
                  )}
                  <div
                    className="relative"
                    onMouseEnter={handleMenuOpen}
                    onMouseLeave={handleMenuClose}
                  >

                    <motion.button
                      aria-label="User profile"
                      className="p-2 rounded-full bg-[#e7e3d8] hover:bg-[#d8d3c6] transition-colors"
                      disabled={userData.user.userProfile === null}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaUser className="w-5 h-5 text-[#5a5f52]" />
                    </motion.button>
                    {isMenuOpen && (
                      <div className="absolute right-0 w-56 bg-white rounded-lg shadow-lg z-50 ">
                        <motion.button
                          onClick={() => {
                            if (userData.user.role !== "admin") {
                              router.push('/dashboard');
                            } else {
                              router.push('/dashboard/admin');
                            }
                          }}
                          className=" w-full px-4 py-3 text-[#5a5f52] hover:bg-[#e7e3d8] text-left font-sora flex items-center gap-2"
                          disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                        >
                          <FaHome className="text-[#6b8f71]" /> Mi Perfil
                        </motion.button>
                        <motion.button
                          onClick={() => router.push("/blog")}
                          className="md:hidden w-full px-4 py-3 text-[#5a5f52] hover:bg-[#e7e3d8] text-left font-sora flex items-center gap-2"
                          disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                        >
                          <FaBlog className="text-[#6b8f71]" /> Blog
                        </motion.button>
                        {userData?.user?.subscriptionType === "premium" && (
                          <motion.button
                            onClick={() => router.push("/chatbot")}
                            className="md:hidden w-full px-4 py-3 text-[#5a5f52] hover:bg-[#e7e3d8] text-left font-sora flex items-center gap-2"
                            disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                          >
                            <FaRobot className="text-[#6b8f71]" /> ChatBot
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => router.push("/dashboard/userSetting")}
                          className="w-full px-4 py-3 text-[#5a5f52] hover:bg-[#e7e3d8] text-left font-sora flex items-center gap-2"
                          disabled={userData.user.userProfile === null && userData.user.role !== "admin"}
                        >
                          <FaCog className="text-[#6b8f71]" /> Ajustes
                        </motion.button>
                        <motion.button
                          onClick={logout}
                          className="w-full px-4 py-3 text-[#5a5f52] hover:bg-[#e7e3d8] text-left font-sora flex items-center gap-2"
                        >
                          <FaSignOutAlt className="text-[#6b8f71]" /> Cerrar Sesión
                        </motion.button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden sm:flex space-x-4 md:mr-12">
                    <motion.button
                      onClick={() => router.push('/login')}
                      className="text-[#5a5f52] text-sm font-sora font-medium hover:text-[#6b8f71] transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      Iniciar Sesión
                    </motion.button>

                    <motion.button
                      onClick={() => router.push('/register')}
                      className="bg-[#6b8f71] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#5a7c62] transition-colors font-sora font-medium text-sm "
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Registrarse
                    </motion.button>
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
    </div>
  );
};

export default Navbar;
