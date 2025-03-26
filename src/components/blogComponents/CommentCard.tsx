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
  // Verificación de seguridad
  if (!comment || !comment.user) {
    return null;
  }
  console.log("Datos del comentario en CommentCard:", comment);
  const formattedDate = comment.createdAt 
    ? new Date(comment.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Fecha desconocida';

  return (
    <div className="bg-gray-50 p-4 rounded-lg relative">
      {canDelete && onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          aria-label="Eliminar comentario"
          data-testid="delete-comment-button"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
      <p className="text-gray-800">{comment.content || 'Contenido no disponible'}</p>
      <div className="mt-2 text-xs text-gray-500">
        <span>Por: {comment.user.name || 'Anónimo'} • </span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default CommentCard;