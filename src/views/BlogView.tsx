'use client';
import React, { useState, useEffect, useCallback } from 'react';
import PostList from '@/components/blogComponents/PostList';
import PostForm from '@/components/blogComponents/PostForm';
import { getAllPosts, updatePost, deletePost, createPost } from '../helpers/blogHelpers/postHelper';
import { useAuth } from '@/context/AuthContext';
import { Post, PostErrors, PostTag } from '@/types';
import { toast } from 'react-toastify';
import { validatePostForm } from '@/helpers/blogHelpers/blogValidations';
import { toggleFavorite, getFavoritesByUser } from '@/helpers/blogHelpers/favoriteHelper';
import { uploadPostImage } from '@/helpers/uploadImage';

const BlogView: React.FC = () => {
  const [favorites, setFavorites] = useState<Record<string, { favoriteId?: string }>>({});
  const { userData } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [formErrors, setFormErrors] = useState<PostErrors>({});
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFormVisible(false);
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isPostOwner = useCallback(
    (postUserId: string) => userData?.user.id === postUserId,
    [userData]
  );

  const loadPosts = useCallback(async () => {
    if (!userData?.token) return;

    setIsLoadingPosts(true);
    try {
      const response = await getAllPosts(
        { page: currentPage, limit: 100 },
        userData.token
      );
      setPosts(response?.items || []);
    } catch (error) {
      toast.error('Error al cargar posts');
      console.error(error);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [userData, currentPage]);

  const loadFavorites = useCallback(async () => {
    if (!userData?.token) return;
    
    setIsLoadingFavorites(true);
    try {
      const response = await getFavoritesByUser(
        { page: 1, limit: 100 }, 
        userData.token
      );
      
      const favoritesMap = response.items.reduce((acc, { post, favoriteId }) => {
        acc[post.id] = { favoriteId };
        return acc;
      }, {} as Record<string, { favoriteId: string }>);
      
      setFavorites(favoritesMap);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Error al cargar favoritos");
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [userData]);

  useEffect(() => {
    loadPosts();
    loadFavorites();
  }, [loadPosts, loadFavorites]);

  const handleCreatePost = async (postData: {
    title: string;
    content: string;
    tags?: PostTag[];
    image?: File;
  }) => {
    const errors = validatePostForm(postData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const createdPost = await createPost(
        { title: postData.title, content: postData.content, tags: postData.tags },
        userData!.token
      );

      if (postData.image) {
        await uploadPostImage(createdPost.id, postData.image, userData!.token);
      }

      await loadPosts();
      setIsFormVisible(false);
      toast.success('Post creado exitosamente!');
    } catch (error) {
      toast.error('Error al crear post');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (
    postId: string,
    updatedData: { title: string; content: string; tags?: PostTag[]; image?: File }
  ) => {
    setIsSubmitting(true);
    try {
      await updatePost(postId, updatedData, userData!.token);

      if (updatedData.image) {
        await uploadPostImage(postId, updatedData.image, userData!.token);
      }

      await loadPosts();
      setIsEditModalOpen(false);
      toast.success('Post actualizado!');
    } catch (error) {
      toast.error('Error al actualizar post');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId, userData!.token);
      await loadPosts();
      toast.success('Post eliminado');
    } catch (error) {
      toast.error('Error al eliminar post');
      console.error(error);
    }
  };

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
  
      setFavorites(prev => {
        const updated = { ...prev };
        if (result.favoriteId) {
          updated[postId] = { favoriteId: result.favoriteId };
        } else {
          delete updated[postId];
        }
        return updated;
      });
  
      return result;
    } catch (error) {
      toast.error("Error al actualizar favoritos");
      console.error(error);
      throw error;
    }
  };
   if (!userData?.token) {
    return (
      <div className="text-center py-8">
        <p className="text-[#424242] font-sora">Debes iniciar sesión para ver el blog</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-sora font-semibold text-[#242424]">Blog Nutricional</h1>
        <button
          onClick={() => setIsFormVisible(true)}
          className="px-6 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full font-sora transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978]"
          disabled={isSubmitting}
        >
          Crear Nuevo Post
        </button>
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PostForm
              onSubmit={handleCreatePost}
              onCancel={() => setIsFormVisible(false)}
              errors={formErrors}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {isEditModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PostForm
              initialData={selectedPost}
              onSubmit={(data) => handleUpdatePost(selectedPost.id, data)}
              onCancel={() => setIsEditModalOpen(false)}
              errors={formErrors}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {isLoadingPosts ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9DC08B] mx-auto"></div>
          <p className="mt-4 text-[#424242] font-sora">Cargando posts...</p>
        </div>
      ) : (
        <PostList
          posts={posts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isPostOwner={isPostOwner}
          onEdit={(postId) => {
            const post = posts.find(p => p.id === postId);
            if (post) {
              setSelectedPost(post);
              setIsEditModalOpen(true);
            }
          }}
          onDelete={handleDeletePost}
          currentUserId={userData.user.id}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          isLoadingFavorites={isLoadingFavorites}
        />
      )}
    </div>
  );
};

export default BlogView;