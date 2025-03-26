import React from 'react';
import CommentCard from './CommentCard';
import { Comment } from '@/types';

interface CommentListProps {
  comments?: Comment[]; // Hacer opcional
  onDeleteComment?: (commentId: string) => void;
  isPostOwner?: (userId: string) => boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  
  comments = [], // Valor por defecto
  onDeleteComment,
  isPostOwner,
  hasMore,
  onLoadMore
}) => {
  // Filtramos comentarios no válidos
  const validComments = comments.filter(comment => 
    comment?.id && 
    comment?.user?.id && 
    comment?.content
  );

  if (validComments.length === 0) {
    console.log("Comentarios recibidos en CommentList:", comments);
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No hay comentarios aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {validComments.map((comment) => (
        <CommentCard 
          key={comment.id}
          comment={comment}
          onDelete={onDeleteComment ? () => onDeleteComment(comment.id) : undefined}
          canDelete={isPostOwner ? isPostOwner(comment.user.id) : false}
        />
      ))}
      
      {hasMore && onLoadMore && (
        <button
          onClick={onLoadMore}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cargar más comentarios
        </button>
      )}
    </div>
  );
};

export default CommentList;