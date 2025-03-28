import React from 'react';
import CommentCard from './CommentCard';
import { Comment } from '@/types';

interface CommentListProps {
  comments?: Comment[];
  onDeleteComment?: (commentId: string) => void;
  isPostOwner?: (userId: string) => boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments = [],
  onDeleteComment,
  isPostOwner,
  hasMore,
  onLoadMore
}) => {
  const validComments = comments.filter(comment => 
    comment?.id && 
    comment?.user?.id && 
    comment?.content
  );

  if (validComments.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-[#a2a2a2] font-sora">No hay comentarios aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
          className="w-full py-2 bg-[#f0f0f0] text-[#424242] rounded-full font-sora text-sm hover:bg-[#e0e0e0] transition-colors"
        >
          Cargar más comentarios
        </button>
      )}
    </div>
  );
};

export default CommentList;