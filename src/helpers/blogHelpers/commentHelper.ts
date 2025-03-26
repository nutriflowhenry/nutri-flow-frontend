import { Comment, PaginatedResponse } from '@/types';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const createComment = async (
  postId: string,
  commentData: { content: string },
  token: string
): Promise<Comment> => {
  try {
    const response = await fetch(`${APIURL}/post/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear comentario');
    }

    const { newComment } = await response.json();
    
    // Asegurar que el comentario tenga la estructura esperada
    return {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt || newComment.createdAt,
      postId: newComment.postId,
      user: {
        id: newComment.userId, // Asume que el backend devuelve userId
        name: newComment.userName || 'Usuario', // Valor por defecto
        email: '', // Agregar si es necesario
        profilePicture: newComment.userProfilePicture || ''
      }
    };
    
  } catch (error) {
    console.error('Error en createComment:', error);
    throw error;
  }
};

export const getCommentsByPost = async (
  postId: string | null,
  params: { page: number; limit: number },
  token: string
): Promise<PaginatedResponse<Comment>> => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString()
  });

  const response = await fetch(`${APIURL}/post/${postId}/comment?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener comentarios');
  }

  // Mapea la respuesta del backend a la estructura esperada
  return {
    items: data.comments || [], // Cambia data.items por data.comments
    total: data.pagination?.commentCount || 0,
    page: data.pagination?.page || 1,
    limit: data.pagination?.limit || params.limit,
    totalPages: data.pagination?.totalPages || 1
  };
};
export const deleteComment = async (
  postId: string,
  commentId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${APIURL}/post/${postId}/comment/my/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error al eliminar comentario');
  }
};