"use client";
import CardPostAdmin from "@/components/CardPostAdmin";
import { useAuth } from "@/context/AuthContext";
import { activatePost, banPost, getAllPost } from "@/helpers/admin.helper";
import { IPostList } from "@/types";
import React, { useEffect, useState } from "react";

const ReviewsAdminView = () => {
    const { userData } = useAuth();
    const [allPost, setAllPost] = useState<IPostList | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNoPostsMessage, setShowNoPostsMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPost = async (page:number) => {
            if (!userData?.token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await getAllPost(userData?.token,page);
                setAllPost(response);
            } catch (error) {
                console.error("Error al obtener Post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost(currentPage);
    }, [userData?.token]);

    useEffect(() => {
        if (!loading && (!allPost || allPost.posts.length === 0)) {
            const timer = setTimeout(() => {
                setShowNoPostsMessage(true);
            }, 3000); 

            return () => clearTimeout(timer); 
        } else {
            setShowNoPostsMessage(false); 
        }
    }, [loading, allPost]);

    const handlePostStatus = async (id: string, status: string) => {
        if (!userData?.token) return;
        try {
            if (status === "approved") {
                await banPost(userData.token, id);
            } else {
                await activatePost(userData.token, id);
            }
            const response = await getAllPost(userData?.token);
            setAllPost(response);
        } catch (error) {
            console.error("Error al cambiar el estado del post:", error);
        }
    };

    const handleNextPage = () => {
        if (allPost && currentPage < allPost.pagination.totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    if (loading) {
        return (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        );
      }

    return (
        <div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reseñas...</p>
          </div>
        ) : allPost && allPost.posts.length > 0 ? (
          <div>
            <h1 className="text-2xl font-bold mb-4 mt-10 text-center">Reseñas Nutriflow</h1>
            <div>
              {allPost.posts.map((post) => (
                <CardPostAdmin key={post.id} post={post} handlePostStatus={handlePostStatus} />
              ))}
            </div>
            <div className="flex justify-center mt-4 mb-6">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mx-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#eecb78] text-white hover:bg-[#cf9d52]'}`}
                >
                    Anterior
                </button>
                <span className="px-4 py-2">{currentPage} / {allPost.pagination.totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= allPost.pagination.totalPages}
                    className={`px-4 py-2 mx-2 rounded ${currentPage >= allPost.pagination.totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#eecb78] text-white hover:bg-[#cf9d52]'}`}
                >
                    Siguiente
                </button>
            </div>
          </div>
        ) : showNoPostsMessage ?(
          <p>No hay publicaciones disponibles.</p>
        ): null}
      </div>
    );
};

export default ReviewsAdminView;