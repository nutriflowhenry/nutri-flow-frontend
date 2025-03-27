import { ApiPost, PaginatedResponse, Post, PostTag } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// interface PostResponse {
//   posts: Post[];
//   total: number;
// }

export const createPost = async (
  postData: { 
    title: string; 
    content: string;
    tags?: PostTag[]; // Usar el enum
  }, 
  token: string
): Promise<Post> => {
  try {
    // Convertir tags a string si es necesario (depende de tu API)
    const payload = {
      ...postData,
      tags: postData.tags || [] // Asegurar array vacío si no hay tags
    };

    const response = await fetch(`${APIURL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el post');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Lista de tags válidos según el backend
const VALID_TAGS = [
  'Vegetarian', 'Vegan', 'GlutenFree', 'LowFat', 'Quick',
  'Dessert', 'Breakfast', 'HighInProtein', 'DairyFree', 'SugarFree'
];

export const getAllPosts = async (
  params: { 
    page: number; 
    limit: number;
    tags?: PostTag[];
    searchOnTitle?: string;
  },
  token: string
): Promise<PaginatedResponse<Post>> => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString()
    });

    // Solo agregar tags si existen y son válidos
    if (params.tags && params.tags.length > 0) {
      const filteredTags = params.tags.filter(tag => 
        VALID_TAGS.includes(tag)
      );
      if (filteredTags.length > 0) {
        queryParams.append('tags', filteredTags.join(','));
      }
    }

    if (params.searchOnTitle) {
      queryParams.append('searchOnTitle', params.searchOnTitle);
    }

    const response = await fetch(`${APIURL}/post/allActive?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener posts');
    }

    const data = await response.json();

    // Mapear la respuesta del backend a la estructura esperada
    return {
      items: data.posts.map((post: ApiPost) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags || [],
        status: post.status,
        image: post.image,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: post.author.id,
          name: post.author.name,
          profilePicture: post.author.profilePicture
        }
      })),
      total: data.pagination.postCount,
      page: data.pagination.page,
      limit: data.pagination.limit,
      totalPages: data.pagination.totalPages
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  updateData: { 
    title: string; 
    content: string;
    tags?: PostTag[];
  },
  token: string
): Promise<Post> => {
  try {
    const response = await fetch(`${APIURL}/post/update/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar post');
    }

    return data as Post;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (
  postId: string, 
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${APIURL}/post/ban/${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const uploadPostImage = async (
  postId: string,
  file: File,
  token: string
): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${APIURL}/post/${postId}/image`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al subir imagen');
    }

    return data as { imageUrl: string };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};