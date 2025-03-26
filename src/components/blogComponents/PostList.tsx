import React, { useState } from 'react';
import PostCard from './PostCard';
import { Post } from '@/types';

interface PostListProps {
  posts?: Post[];
  isPostOwner: (userId: string) => boolean;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => Promise<void>;
  currentUserId: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts = [],
  isPostOwner,
  onEdit,
  onDelete,
  currentUserId,
  currentPage,
  setCurrentPage,
}) => {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const safePosts = Array.isArray(posts) ? posts : [];
  const totalItems = safePosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safePosts.slice(indexOfFirstItem, indexOfLastItem);

  const toggleComments = (postId: string) => {
    setExpandedPostId(prev => prev === postId ? null : postId);
  };

  if (totalItems === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay posts disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentItems.map((post) => (
  <PostCard
    key={`post-${post.id}`} // 🔹 Asegúrate de que sea único
    post={post}
    isPostOwner={isPostOwner(post.user?.id || '')}
    onEdit={() => onEdit(post.id)}
    onDelete={() => onDelete(post.id)}
    onToggleComments={() => toggleComments(post.id)}
    showComments={expandedPostId === post.id}
    currentUserId={currentUserId}
  />
))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;