"use client";
import {Avatar} from "@/components/Avatar";
import { useAuth } from "@/context/AuthContext";
import { getAllReviews } from "@/helpers/admin.helper";
import { IReviewsList } from "@/types";
import React, { useEffect, useState } from "react";

const ReviewsAdminView = () => {
    const { userData } = useAuth();
    const [allReviews, setAllReviews] = useState<IReviewsList | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNoPostsMessage, setShowNoPostsMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchReviews = async (page: number) => {
            if (!userData?.token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await getAllReviews(userData?.token, page);
                setAllReviews(response);
            } catch (error) {
                console.error("Error al obtener Post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews(currentPage);
    }, [userData?.token]);

    useEffect(() => {
        if (!loading && (!allReviews || allReviews.data.results.length === 0)) {
            const timer = setTimeout(() => {
                setShowNoPostsMessage(true);
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setShowNoPostsMessage(false);
        }
    }, [loading, allReviews]);

    const handleNextPage = () => {
        if (allReviews && currentPage < allReviews.data.totalPages) {
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
            ) : allReviews && allReviews.data.results.length > 0 ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4 mt-10 text-center">Reseñas Nutriflow</h1>
                    <div>
                        {allReviews.data.results.map((review) => (
                            <div key={review.id} className="relative flex items-center bg-white shadow-lg rounded-lg overflow-hidden h-[120px] my-2 max-w-lg mx-auto p-6">

                                <div className="w-1/3 h-full">
                                    <Avatar name={review.user.name} />
                                </div>
                                <div className="p-3 flex flex-col">
                                    <h3 className="font-bold text-lg">{review.user.name}</h3>
                                    <p className="text-justify">{review.content}</p>
                                </div>

                            </div>
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
                        <span className="px-4 py-2">{currentPage} / {allReviews.data.totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= allReviews.data.totalPages}
                            className={`px-4 py-2 mx-2 rounded ${currentPage >= allReviews.data.totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#eecb78] text-white hover:bg-[#cf9d52]'}`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            ) : showNoPostsMessage ? (
                <p>No hay publicaciones disponibles.</p>
            ) : null}
        </div>
    );
};

export default ReviewsAdminView;