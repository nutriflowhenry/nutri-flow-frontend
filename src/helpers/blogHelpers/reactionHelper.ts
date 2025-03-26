const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const addReaction = async (postId: string, token: string) => {
  try {
    const response = await fetch(`${APIURL}/post/${postId}/reaction`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al agregar la reacción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al agregar la reacción:', error);
    throw error;
  }
};

export const getReactionsByUser = async (token: string) => {
  try {
    const response = await fetch(`${APIURL}/post/reaction/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las reacciones');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener las reacciones:', error);
    throw error;
  }
};

export const removeReaction = async (reactionId: string, token: string) => {
  try {
    const response = await fetch(`${APIURL}/post/reaction/${reactionId}/me/delete`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la reacción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar la reacción:', error);
    throw error;
  }
};