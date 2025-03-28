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
  favorites?: Record<string, { favoriteId?: string }>;
  onToggleFavorite?: (
    postId: string, 
    isFavorite: boolean, 
    favoriteId?: string
  ) => Promise<{ favoriteId?: string }>;
  isLoadingFavorites?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts = [],
  isPostOwner,
  onEdit,
  onDelete,
  currentUserId,
  currentPage,
  setCurrentPage,
  favorites,
  onToggleFavorite,
  isLoadingFavorites = false
}) => {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const itemsPerPage = 6;

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
        <p className="text-[#a2a2a2] font-sora">No hay posts disponibles</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {isLoadingFavorites ? (
        <div className="text-center py-4 text-[#a2a2a2] font-sora">Cargando favoritos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {currentItems.map((post) => (
            <PostCard
              key={`post-${post.id}`}
              post={post}
              isPostOwner={isPostOwner(post.user?.id || '')}
              onEdit={() => onEdit(post.id)}
              onDelete={() => onDelete(post.id)}
              onToggleComments={() => toggleComments(post.id)}
              showComments={expandedPostId === post.id}
              currentUserId={currentUserId}
              isFavorite={!!favorites?.[post.id]}
              onToggleFavorite={onToggleFavorite}
              favoriteId={favorites?.[post.id]?.favoriteId}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex gap-4 mt-4 items-center">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#B3B19C] drop-shadow-lg text-white rounded-full disabled:hidden font-sora"
          >
            Anterior
          </button>
          <span className="flex text-[#242424] items-center font-sora">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#B3B19C] drop-shadow-lg text-white rounded-full disabled:hidden font-sora"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;