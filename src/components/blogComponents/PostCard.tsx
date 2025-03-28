import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { Post } from '@/types';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  isPostOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComments: () => void;
  showComments: boolean;
  currentUserId: string;
  isFavorite?: boolean;
  onToggleFavorite?: (postId: string, isFavorite: boolean, favoriteId?: string) => Promise<{ favoriteId?: string }>;
  favoriteId?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isPostOwner,
  onEdit,
  onDelete,
  onToggleComments,
  showComments,
  currentUserId,
  isFavorite = false,
  onToggleFavorite,
  favoriteId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const [localFavoriteId, setLocalFavoriteId] = useState(favoriteId);

  useEffect(() => {
    setLocalIsFavorite(isFavorite);
    setLocalFavoriteId(favoriteId);
  }, [isFavorite, favoriteId]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing || !onToggleFavorite) return;
  
    setIsProcessing(true);
    try {
      const previousIsFavorite = localIsFavorite;
      const previousFavoriteId = localFavoriteId;
      
      setLocalIsFavorite(!previousIsFavorite);
      
      const result = await onToggleFavorite(
        post.id, 
        previousIsFavorite, 
        previousFavoriteId
      );

      if (result.favoriteId) {
        setLocalFavoriteId(result.favoriteId);
      } else {
        setLocalFavoriteId(undefined);
      }
    } catch (error) {
      setLocalIsFavorite(localIsFavorite);
      console.error("Error al actualizar favorito:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatContentWithLineBreaks = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <React.Fragment key={index}>
        {paragraph}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-full flex flex-col">
      {post.image && !imageError && (
        <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-sora font-semibold text-[#242424] break-words">
            {post.title}
          </h3>
          <div className="flex gap-2 items-center">
            {onToggleFavorite && (
              <button
                onClick={handleFavorite}
                disabled={isProcessing}
                className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                aria-label={localIsFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {localIsFavorite ? (
                  <HeartSolid className="h-5 w-5 fill-current" />
                ) : (
                  <HeartOutline className="h-5 w-5" />
                )}
              </button>
            )}
            {isPostOwner && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-[#9DC08B] hover:text-[#8BA978] transition-colors"
                  aria-label="Editar post"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Eliminar post"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-sm font-sora text-[#a2a2a2] mb-4 break-words whitespace-pre-line">
        {formatContentWithLineBreaks(post.content)}
      </p>

        {(post.tags?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-[#f0f0f0] text-[#242424] text-xs rounded-full font-sora"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center text-xs text-[#a2a2a2] font-sora mb-3">
          <span>Por: {post.user?.name || 'Anónimo'}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComments();
          }}
          className="w-full py-2 border-t border-[#f0f0f0] flex items-center justify-center text-sm font-sora text-[#9DC08B] hover:text-[#8BA978] transition-colors"
        >
          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
          {showComments ? 'Ocultar comentarios' : 'Ver comentarios'}
        </button>

        {showComments && (
          <div className="mt-3">
            <CommentSection postId={post.id} currentUserId={currentUserId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;