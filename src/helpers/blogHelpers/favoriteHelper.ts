import { PaginatedResponse, Post, ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: ApiError;
    
    try {
      errorData = await response.json();
      console.error('[handleResponse] Error response:', errorData);
    } catch {
      errorData = {
        message: 'Error desconocido',
        statusCode: response.status
      };
    }

    if (response.status === 409) {
      throw new Error('POST_ALREADY_FAVORITED');
    }

    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const addFavorite = async (
  postId: string,
  token: string,
): Promise<{ favoriteId: string }> => {
  try {
    const response = await fetch(`${API_URL}/post/${postId}/favorite`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await handleResponse<{ favorite: { id: string } }>(response);
    return { favoriteId: data.favorite.id };
  } catch (error) {
    console.error("[addFavorite] Error:", error);
    throw error;
  }
};

export const getFavoritesByUser = async (
  paginationData: { page: number; limit: number },
  token: string
): Promise<PaginatedResponse<{ post: Post; favoriteId: string }>> => {  
  try {
    const queryParams = new URLSearchParams({
      page: paginationData.page.toString(),
      limit: paginationData.limit.toString(),
    });

    const response = await fetch(`${API_URL}/post/favorites/me?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleResponse<{
      favorites: Array<{
        id: string;
        post?: Post;  
        postMessage?: string; 
      }>;
      pagination: {
        currentPage: number;
        limit: number;
        favoritesCount: number;
        totalPages: number;
      };
    }>(response);

    // Filtrar solo los favoritos con posts disponibles
    const validFavorites = data.favorites.filter(fav => fav.post && !fav.postMessage);

    return {
      items: validFavorites.map(fav => ({
        post: fav.post!,
        favoriteId: fav.id
      })),
      total: data.pagination.favoritesCount,
      page: data.pagination.currentPage,
      limit: data.pagination.limit,
      totalPages: data.pagination.totalPages
    };
  } catch (error) {
    console.error('[getFavoritesByUser] Error fetching favorites:', error);
    throw error;
  }
};

export const removeFavorite = async (
  favoriteId: string,
  token: string,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/post/favorite/${favoriteId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    await handleResponse<void>(response);
  } catch (error) {
    console.error("[removeFavorite] Error:", error);
    throw error;
  }
};

export const toggleFavorite = async (
  postId: string,
  isCurrentlyFavorite: boolean,
  token: string,
  favoriteId?: string,
): Promise<{ favoriteId?: string }> => {
  try {
    if (isCurrentlyFavorite) {
      if (!favoriteId) {
        throw new Error("Missing favoriteId");
      }
      await removeFavorite(favoriteId, token);
      return { favoriteId: undefined };
    } else {
      const { favoriteId: newId } = await addFavorite(postId, token);
      return { favoriteId: newId };
    }
  } catch (error) {
    console.error("[toggleFavorite] Error:", error);
    throw error;
  }
};