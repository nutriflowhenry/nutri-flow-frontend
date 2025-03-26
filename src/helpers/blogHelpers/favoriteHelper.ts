const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const addFavorite = async (postId: string, token: string) => {
  try {
    const response = await fetch(`${APIURL}/post/${postId}/favorite`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al agregar a favoritos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al agregar a favoritos:', error);
    throw error;
  }
};

export const getFavoritesByUser = async (paginationData: { page: number; limit: number }, token: string) => {
  try {
    const queryParams = new URLSearchParams({
      page: paginationData.page.toString(),
      limit: paginationData.limit.toString(),
    }).toString();

    const response = await fetch(`${APIURL}/post/favorites/me?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los favoritos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los favoritos:', error);
    throw error;
  }
};

export const removeFavorite = async (favoriteId: string, token: string) => {
  try {
    const response = await fetch(`${APIURL}/post/favorite/${favoriteId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar de favoritos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar de favoritos:', error);
    throw error;
  }
};