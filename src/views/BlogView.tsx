'use client';
import React, { useState, useEffect, useCallback } from 'react';
import PostList from '@/components/blogComponents/PostList';
import PostForm from '@/components/blogComponents/PostForm';
import {
  // createPost,
  getAllPosts,
  updatePost,
  deletePost,
} from '../helpers/blogHelpers/postHelper';
import { useAuth } from '@/context/AuthContext';
import { Post, PostErrors, PostTag } from '@/types';
import { toast } from 'react-toastify';
import { validatePostForm } from '@/helpers/blogHelpers/blogValidations';

const BlogView: React.FC = () => {
  const { userData, isLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [formErrors, setFormErrors] = useState<PostErrors>({});
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Nuevo estado para paginación

  // Cerrar modal al presionar Escape
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

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    toast.error(message);
    console.error(error);
  }, []);

  const loadPosts = useCallback(async () => {
    if (!userData?.token) return;

    setIsLoadingPosts(true);
    try {
      const response = await getAllPosts(
        { page: currentPage, limit: 10 }, // Usar currentPage
        userData.token
      );
      setPosts(response?.items || []);
    } catch (error) {
      handleError(error, 'Error al cargar posts');
    } finally {
      setIsLoadingPosts(false);
    }
  }, [userData, currentPage, handleError]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (postData: {
    title: string;
    content: string;
    tags?: PostTag[];
  }) => {
    const errors = validatePostForm(postData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      // const newPost = await createPost(postData, userData!.token);
      setCurrentPage(1); // Resetear a página 1
      await loadPosts(); // Forzar re-fetch
      setIsFormVisible(false);
      toast.success('Post creado exitosamente!');
    } catch (error) {
      handleError(error, 'Error al crear post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (
    postId: string,
    updatedData: { title: string; content: string; tags?: PostTag[] }
  ) => {
    setIsSubmitting(true);
    try {
      await updatePost(postId, updatedData, userData!.token);
      await loadPosts(); // Re-fetch después de actualizar
      setIsEditModalOpen(false);
      toast.success('Post actualizado!');
    } catch (error) {
      handleError(error, 'Error al actualizar post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId, userData!.token);
      await loadPosts(); // Re-fetch después de eliminar
      toast.success('Post eliminado');
    } catch (error) {
      handleError(error, 'Error al eliminar post');
    }
  };


  const handleEditPost = (postId: string) => {
    const postToEdit = posts.find(post => post.id === postId);
    if (postToEdit && isPostOwner(postToEdit.user.id)) {
      setSelectedPost(postToEdit);
      setIsEditModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData?.token) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">Debes iniciar sesión para ver el blog</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Blog Nutricional</h1>
        <button
          onClick={() => setIsFormVisible(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publicando...' : 'Crear Nuevo Post'}
        </button>
      </div>

      {/* Modal para Crear Post */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <PostForm
                onSubmit={handleCreatePost}
                onCancel={() => setIsFormVisible(false)}
                errors={formErrors}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Post */}
      {isEditModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <PostForm
                initialData={selectedPost}
                onSubmit={(data) => handleUpdatePost(selectedPost.id, data)}
                onCancel={() => setIsEditModalOpen(false)}
                errors={formErrors}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {isLoadingPosts ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando posts...</p>
        </div>
      ) : (
        <PostList
        posts={posts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isPostOwner={isPostOwner}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        currentUserId={userData.user.id}
      />
      )}
    </div>
  );
};

export default BlogView;