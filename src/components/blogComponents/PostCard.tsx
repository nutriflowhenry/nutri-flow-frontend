import React from 'react';
import { PencilIcon, TrashIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
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
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isPostOwner,
  onEdit,
  onDelete,
  onToggleComments,
  showComments,
  currentUserId,
}) => {
  if (!post?.id) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 break-words">
            {post.title}
          </h3>
          {isPostOwner && (
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Editar post"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-600 hover:text-red-800 transition-colors"
                aria-label="Eliminar post"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 break-words">
          {post.content}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Por: {post.user?.name || 'Anónimo'}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="border-t p-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComments();
          }}
          className="flex items-center text-gray-600 hover:text-gray-800 w-full justify-center"
        >
          <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
          {showComments ? 'Ocultar comentarios' : 'Ver comentarios'}
        </button>
      </div>

      {showComments && (
        <div className="border-t">
          <CommentSection postId={post.id} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
};

export default PostCard;