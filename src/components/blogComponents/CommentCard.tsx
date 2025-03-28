import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Comment } from '@/types';

interface CommentCardProps {
  comment: Comment;
  onDelete?: () => void;
  canDelete: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({ 
  comment, 
  onDelete,
  canDelete 
}) => {
  if (!comment || !comment.user) {
    return null;
  }

  const formattedDate = comment.createdAt 
    ? new Date(comment.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Fecha desconocida';

  return (
    <div className="bg-[#f8f8f8] p-4 rounded-xl relative">
      {canDelete && onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
          aria-label="Eliminar comentario"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
      <p className="text-[#424242] font-sora text-sm">{comment.content || 'Contenido no disponible'}</p>
      <div className="mt-2 text-xs text-[#a2a2a2] font-sora">
        <span>Por: {comment.user.name || 'Anónimo'} • </span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default CommentCard;