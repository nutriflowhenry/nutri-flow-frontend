'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { IPost, IPostList, IUsersStatistics } from '@/types';
import { getAllPost, getUserStatistics } from '@/helpers/admin.helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faList, faUser, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import VerticalGraphic from '@/components/VerticalGraphic';

const DashboardAdminView = () => {
    const { userData } = useAuth();
    const [userStatistics, setUserStatistics] = useState<IUsersStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [latestPosts, setLatestPost] = useState<IPost[]>([]);

    useEffect(() => {
        const fetchUserStatistics = async () => {
            if (!userData?.token) {
                return;
            } setIsLoading(true);
            try {
                const statistics = await getUserStatistics(userData?.token);
                setUserStatistics(statistics);


            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setIsLoading(false);
            }    
        };
        fetchUserStatistics();
    }, [userData]);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            if (!userData?.token) return;
            setIsLoading(true);
            
            try {
                const response: IPostList = await getAllPost(userData.token);
                const activePosts = response.posts.filter(post=>post.status === "approved");
                const sortedPosts = activePosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setLatestPost(sortedPosts.slice(0, 3));
            } catch (error) {
                console.error("Error al obtener las últimas publicaciones:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchLatestPosts();
    }, [userData?.token]);

    const bgColors = ["bg-[#e6f5d2]", "bg-[#fbeecf]", "bg-[#efd3f4]"];

    return (

        <div>
            {isLoading}
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
                    <div className="bg-[#9ead89]  text-white shadow-md rounded-lg p-2 w-32 h-44 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 text-center flex items-center justify-center font-bold flex-col gap-1 text-1xl">
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
            
            <div className="mx-auto mt-32 md:mt-32 lg:mt-36 xl:mt-40 mb-8 bg-white shadow-md rounded-lg max-w-[90%] sm:max-w-[80%] md:max-w-4xl min-h-[250px] flex flex-wrap md:flex-nowrap items-center justify-between overflow-hidden">
                    <div className="w-full md:w-1/2 flex justify-center md:justify-start ml-0 md:ml-6">
                    <VerticalGraphic />
                    </div>
                    <div className="w-full md:w-1/2 mr-6 pt-6 md:mt-0 md:mx-6 md:mb-6 sm:mx-6 sm:mb-6">
                            <div className="flex items-center justify-center">
                                <FontAwesomeIcon icon={faList} className="text-2xl text-[#394e3ff4] mr-2" />
                                <h3 className="text-xl font-bold text-black text-center">Últimas Publicaciones</h3>
                            </div>
                        {latestPosts.map((post,index)=>(
                            <div key={post.id} className="relative flex items-center bg-white shadow-lg rounded-lg overflow-hidden h-[90px] my-2">
                                
                                        <div className="w-1/3 h-full">
                                        <img src={post.image} className="w-full h-full min-h-[80px] object-cover"/>
                                        </div>
                                        <div className="w-2/3 p-3 flex flex-col">
                                        <h3 className="font-bold text-lg">{post.author.name}</h3>
                                        <p className="text-sm line-clamp-2">{post.title}</p>
                                        </div>
                                    <div className={`absolute top-0 right-0 h-full w-2 ${bgColors[index % bgColors.length]}`}></div>
                                
                            </div>
                        ))}
                    </div>
            </div>

        </div>
        
    );
};

export default DashboardAdminView;