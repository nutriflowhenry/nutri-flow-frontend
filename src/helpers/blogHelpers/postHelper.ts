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
    tags?: PostTag[];
  }, 
  token: string
): Promise<Post> => {
  try {
    const response = await fetch(`${APIURL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json(); 
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear el post');
    }

    
    return {
      id: data.sanitizedPost.id,
      title: data.sanitizedPost.title,
      content: data.sanitizedPost.content,
      tags: data.sanitizedPost.tags || [],
      status: 'approved',
      image: data.sanitizedPost.image || undefined,
      createdAt: data.sanitizedPost.createdAt,
      updatedAt: data.sanitizedPost.updatedAt,
      user: {
        id: data.sanitizedPost.author,
        name: '', 
        profilePicture: '',
        email: ''
      }
    };
    
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
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
    const response = await fetch(`${APIURL}/post/deactivate/${postId}`, {
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

