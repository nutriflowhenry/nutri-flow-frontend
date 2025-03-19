'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { IUsersStatistics } from '@/types';
import { getUserStatistics } from '@/helpers/admin.helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faUser, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import UsersList from '@/components/UsersList';
import VerticalGraphic from '@/components/VerticalGraphic';
import UsersPaymentsList from '@/components/UsersPaymentsList';

const DashboardAdminView = () => {
    const { userData } = useAuth();
    const [userStatistics, setUserStatistics] = useState<IUsersStatistics | null>(null);
    const [activeTab, setActiveTab] = useState("payments");
    
    useEffect(() => {
        const fetchUserStatistics = async () => {
            if (!userData?.token) {
                return;
            }
            try {
                const statistics = await getUserStatistics(userData?.token);
                setUserStatistics(statistics);

            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };
        fetchUserStatistics();
    }, [userData]);

    return (

        <div>
            <div className="relative mx-auto bg-white shadow-md rounded-lg mt-8 max-w-[90%] sm:max-w-[80%] md:max-w-4xl min-h-[250px] flex flex-col justify-end">
            <div className="flex justify-center w-full">
            {userData?.user.profilePicture ? (
                <img
                    src={userData?.user.profilePicture} 
                    alt="foto Perfil"
                    className="w-24 h-24 rounded-full border-4 border-gray-200"
                />
            ) : (
                <FontAwesomeIcon icon={faCircleUser} className="w-24 h-24 text-gray-400 rounded-full" />
            )}
            </div>
                <h1 className="text-2xl mb-24 md:mb-28 font-bold text-black text-center">¡Bienvenido {userData?.user.name}!</h1>

                <div className="absolute left-1/2 -translate-x-1/2 mb-4 translate-y-2/3 flex justify-center gap-2 md:gap-8 lg:gap-12">
                    <div className="bg-[#9ead89] text-white shadow-md rounded-lg p-2 w-32 h-44 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 text-center flex items-center justify-center font-bold flex-col gap-1 text-1xl">
                        <div className="w-16 h-16 bg-[#d0dfbd] flex items-center justify-center rounded-full">
                            <FontAwesomeIcon icon={faUsers} className="text-2xl text-[#faf9f8dc]" />
                        </div>
                        Usuarios Activos
                        <p className="text-3xl">{userStatistics?.usersNumber}</p>
                    </div>
                    <div className="bg-[#bed290] text-white shadow-md rounded-lg p-2 w-32 h-44 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 text-center flex items-center justify-center font-bold flex-col gap-3 md:gap-1 text-1xl">
                        <div className="w-16 h-16 bg-[#e3ead3] flex items-center justify-center rounded-full">
                            <FontAwesomeIcon icon={faUser} className="text-2xl text-[#faf9f8dc]" />
                        </div>
                        Usuarios Free
                        <p className="text-3xl">{userStatistics?.freeUsers}</p>
                    </div>
                    <div className="bg-[#e3d6b8] text-white shadow-md rounded-lg p-2 w-32 h-44 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 text-center flex items-center justify-center font-bold flex-col gap-1 text-1xl">
                        <div className="w-16 h-16 bg-[#eee6d3] flex items-center justify-center rounded-full">
                            <FontAwesomeIcon icon={faUserPlus} className="text-2xl text-[#faf9f8dc]" />
                        </div>
                        Usuarios Premium
                        <p className="text-3xl">{userStatistics?.premiumUsers}</p>
                    </div>
                </div>
            </div>
            
            <div className="mx-auto mt-32 md:mt-32 lg:mt-36 xl:mt-40 mb-5 bg-white shadow-md rounded-lg max-w-[90%] sm:max-w-[80%] md:max-w-4xl min-h-[250px] flex items-center justify-center">
                    <VerticalGraphic />
            </div>

            <div className="mx-auto mt-9 md:mt-10 lg:mt-12 xl:mt-20 mb-5 max-w-[90%] sm:max-w-[80%] md:max-w-4xl min-h-[50px] flex justify-between">
                <button
                    className={`w-1/2 bg-[#ebc46f] text-white font-semibold h-full min-h-[50px] mr-2 rounded-lg shadow-md flex items-center justify-center hover:bg-[#d4ad60] hover:shadow-lg ${
                        activeTab === "payments" ? "opacity-100" : "opacity-70"
                    }`}
                    onClick={() => setActiveTab("payments")}>
                    Listado Pagos Efectuados
                </button>
                <button
                    className={`w-1/2 bg-[#929a5e] text-white font-semibold h-full min-h-[50px] ml-2 rounded-lg shadow-md flex items-center justify-center  hover:bg-[#7f8654] hover:shadow-lg ${
                        activeTab === "users" ? "opacity-100" : "opacity-70"
                    }`}
                    onClick={() => setActiveTab("users")}>
                    Listado Usuarios Nutriflow
                </button>
  
            </div>

            <div className="relative mx-auto mb-8 bg-white shadow-md rounded-lg max-w-[90%] sm:max-w-[80%] md:max-w-4xl min-h-[250px] flex flex-col justify-between">
                {activeTab === "users" ? <UsersList /> : <UsersPaymentsList />}
            </div>
        </div>
        
    );
};

export default DashboardAdminView;