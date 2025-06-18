'use client';
import React, { useState, useEffect, useCallback } from 'react';
import PostList from '@/components/blogComponents/PostList';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import { toast } from 'react-toastify';
import { getFavoritesByUser, toggleFavorite } from '@/helpers/blogHelpers/favoriteHelper';
import { getAllPosts } from '@/helpers/blogHelpers/postHelper';

const FavoritesView: React.FC = () => {
    const { userData } = useAuth();
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
    const [favoritesMap, setFavoritesMap] = useState<Record<string, { favoriteId?: string }>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

    const isPostOwner = useCallback(
        (postUserId: string) => userData?.user.id === postUserId,
        [userData]
    );

    const loadFavorites = useCallback(async () => {
        if (!userData?.token) return;

        setIsLoading(true);
        setIsLoadingFavorites(true);

        try {
            // Obtener los IDs de los posts favoritos
            const favoritesResponse = await getFavoritesByUser(
                { page: 1, limit: 100 },
                userData.token
            );

            // Crear mapa de favoritos
            const newFavoritesMap = favoritesResponse.items.reduce((acc, { post, favoriteId }) => {
                acc[post.id] = { favoriteId };
                return acc;
            }, {} as Record<string, { favoriteId: string }>);

            setFavoritesMap(newFavoritesMap);

            // Obtener todos los posts para filtrar los favoritos
            const postsResponse = await getAllPosts(
                { page: 1, limit: 100 },
                userData.token
            );

            // Filtrar solo los posts que están en favoritos
            const favoritePosts = postsResponse?.items.filter(post =>
                newFavoritesMap[post.id]
            ) || [];

            setFavoritePosts(favoritePosts);
        } catch (error) {
            console.error("Error loading favorites:", error);
            toast.error("Error al cargar favoritos");
        } finally {
            setIsLoading(false);
            setIsLoadingFavorites(false);
        }
    }, [userData]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const handleToggleFavorite = async (
        postId: string,
        isFavorite: boolean,
        favoriteId?: string
    ): Promise<{ favoriteId?: string }> => {
        try {
            const result = await toggleFavorite(
                postId,
                isFavorite,
                userData!.token,
                favoriteId
            );

            // Actualizar el mapa de favoritos
            setFavoritesMap(prev => {
                const updated = { ...prev };
                if (result.favoriteId) {
                    updated[postId] = { favoriteId: result.favoriteId };
                } else {
                    delete updated[postId];
                }
                return updated;
            });

            // Eliminar el post de la lista si se quitó de favoritos
            if (!result.favoriteId) {
                setFavoritePosts(prev => prev.filter(post => post.id !== postId));
            }

            return result;
        } catch (error) {
            toast.error("Error al actualizar favoritos");
            console.error(error);
            throw error;
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            // Eliminar de favoritos primero
            const favoriteId = favoritesMap[postId]?.favoriteId;
            if (favoriteId) {
                await toggleFavorite(
                    postId,
                    true, // isFavorite = true para eliminarlo
                    userData!.token,
                    favoriteId
                );
            }

            // Actualizar el estado
            setFavoritePosts(prev => prev.filter(post => post.id !== postId));
            setFavoritesMap(prev => {
                const updated = { ...prev };
                delete updated[postId];
                return updated;
            });

            toast.success('Post eliminado de favoritos');
        } catch (error) {
            toast.error('Error al eliminar post de favoritos');
            console.error(error);
        }
    };

    if (!userData?.token) {
        return (
            <div className="text-center py-8">
                <p className="text-[#424242] font-sora">Debes iniciar sesión para ver tus favoritos</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-sora font-semibold text-[#242424]">Mis Publicaciones Favoritas</h1>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9DC08B] mx-auto"></div>
                    <p className="mt-4 text-[#424242] font-sora">Cargando favoritos...</p>
                </div>
            ) : favoritePosts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-[#a2a2a2] font-sora">No tienes publicaciones favoritas aún</p>
                </div>
            ) : (
                <PostList
                    posts={favoritePosts}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isPostOwner={isPostOwner}
                    onEdit={() => { }} // No permitir edición en la vista de favoritos
                    onDelete={handleDeletePost}
                    currentUserId={userData.user.id}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favoritesMap}
                    isLoadingFavorites={isLoadingFavorites}
                />
            )}
        </div>
    );
};

export default FavoritesView;