"use client";
import CardPostAdmin from "@/components/CardPostAdmin";
import { useAuth } from "@/context/AuthContext";
import { activatePost, banPost, getAllPost } from "@/helpers/admin.helper";
import { IPostList } from "@/types";
import React, { useEffect, useState } from "react";

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
            } else {
                await activatePost(userData.token, id);
            }
            const response = await getAllPost(userData?.token);
            setAllPost(response);
        } catch (error) {
            console.error("Error al cambiar el estado del post:", error);
        }
    };

    return (
        <div>
            {loading}
            {allPost ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4 mt-10 text-center">Publicaciones Blog</h1>
                    <div>
                        {allPost.posts.map((post) => (
                            <CardPostAdmin key={post.id} post={post} handlePostStatus={handlePostStatus} />
                        ))}
                    </div>
                    <p>Página: {allPost.pagination.page} / {allPost.pagination.totalPages}</p>
                </div>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default PostsAdminView;