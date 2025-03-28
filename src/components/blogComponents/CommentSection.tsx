import React, { useState, useEffect, useCallback } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { getCommentsByPost, deleteComment, createComment } from '../../helpers/blogHelpers/commentHelper';
import { useAuth } from "@/context/AuthContext";
import { toast } from 'react-toastify';
import { Comment } from '@/types';

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData } = useAuth();

  const loadComments = useCallback(async () => {
    if (!userData?.token) return;
    
    setIsLoading(true);
    try {
      const response = await getCommentsByPost(
        postId,
        { page: 1, limit: 50 },
        userData.token
      );
      
      
      const formattedComments = response.items.map(comment => ({
        ...comment,
        postId: postId,
        user: comment.user || {
          id: currentUserId,
          name: userData.user?.name || 'Usuario',
          email: userData.user?.email || '',
          profilePicture: userData.user?.profilePicture || ''
        }
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Error al cargar comentarios');
    } finally {
      setIsLoading(false);
    }
  }, [postId, userData, currentUserId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async (commentData: { content: string }) => {
    
    if (!userData?.token) return;

    setIsSubmitting(true);
    try {
       const newComment = await createComment(
       postId,
       commentData,
         userData.token
       );

      
      await loadComments();
      console.log(newComment)
      toast.success('Comentario agregado!');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al agregar comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!userData?.token) return;

    try {
      await deleteComment(
        postId,
        commentId,
        userData.token
      );
      
      
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      toast.success('Comentario eliminado');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar comentario');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <CommentForm 
        onSubmit={handleSubmitComment} 
        isSubmitting={isSubmitting}
      />

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9DC08B] mx-auto"></div>
          <p className="mt-2 text-[#424242] font-sora">Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-[#a2a2a2] font-sora">
          Aún no hay comentarios. ¡Sé el primero en comentar!
        </div>
      ) : (
        <CommentList
          comments={comments}
          onDeleteComment={handleDeleteComment}
          isPostOwner={(userId) => userId === currentUserId}
        />
      )}
    </div>
  );
};

export default CommentSection;