'use client'
import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext'
import { approvePost, banPost, getAllPost } from '@/helpers/admin.helper';
import { IPostList } from '@/types';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'

const PostsAdminView = () => {
    const { userData } = useAuth();
    const [allPost, setAllPost] = useState<IPostList | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPost = async () => {
            if (!userData?.token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await getAllPost(userData?.token);
                setAllPost(response);

            } catch (error) {
                console.error("Error al obtener Post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [userData?.token]);

    const handlePostStatus = async (id: string, status: string) => {
        if (!userData?.token) return;
        try {
            if (status === "approved") {
                await banPost(userData.token, id);
                const response = await getAllPost(userData?.token);
                setAllPost(response);
            } else {
                await approvePost(userData.token, id);
                const response = await getAllPost(userData?.token);
                setAllPost(response); 
            }
        } catch (error) {
            console.error("Error al cambiar el estado del post:", error);
        }
    };
    return (
        <div>
            {loading ? (
                <p>Cargando...</p>
            ) : allPost ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4 mt-10 text-center">Posts Blog</h1>
                    <div>
                        {allPost.posts.map((post) => (
                            <div key={post.id} className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-5 max-w-md md:max-w-2xl ">
                            <div className="flex items-start px-4 py-6">
                                <div>
                                    <Avatar name={post.author.name} profilePicture={post.author.profilePicture}/>
                                </div>
                                <div>
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-semibold text-gray-900 -mt-1">{post.author.name}</h2>
                                        <h3 className="text-lg font-semibold text-gray-900 -mt-1">{post.title}</h3>
                                    </div>
                                    <p className="mt-3 text-gray-700 text-sm">
                                        {post.content}
                                    </p>
                                    <div>
                                        <img src={post.image}/>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <div className="flex mr-2 text-gray-700 text-sm ">
                                            <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-1" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span>{post.reactions.length}</span>
                                        </div>
                                        <div className="flex mr-2 text-gray-700 text-sm ">
                                            <button onClick={() => handlePostStatus(post.id, post.status)} className="mx-1">
                                                <FontAwesomeIcon icon={post.status === "approved" ? faBan : faCheck} className={`text-1xl mr-1 ${post.status === "approved" ? "text-[#f00c0ce9]" : "text-green-500"}`}/>
                                                    {post.status === "approved" ? "Bloquear" : "Desbloquear"}
                                            </button>
                                        </div>
                                                                 
                                    </div>
                                </div>
                            </div>
                        </div>        
                        ))}
                    </div>
                    
                    <p>Página: {allPost.pagination.page} / {allPost.pagination.totalPages}</p>
                </div>
            ) : (
                "No hay datos disponibles"
            )}
                                    
        </div>
    );

};

export default PostsAdminView;