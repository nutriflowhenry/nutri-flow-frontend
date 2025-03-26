import React, { useState} from 'react';
// import { TrashIcon } from '@heroicons/react/24/outline';
import { Post, PostErrors, PostTag } from '@/types';
import TagSelector from './TagSelector';

interface PostFormProps {
  initialData?: Post;
  onSubmit: (data: { title: string; content: string; tags?: PostTag[] }) => void;
  onCancel: () => void;
  errors: PostErrors;
  isSubmitting?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, onCancel, errors, isSubmitting }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<PostTag[]>(initialData?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, tags });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Post' : 'Crear Post'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Título
            {errors.title && (
              <span className="text-red-500 text-xs ml-2">{errors.title}</span>
            )}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Escribe un título interesante"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contenido
            {errors.content && (
              <span className="text-red-500 text-xs ml-2">{errors.content}</span>
            )}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full p-2 border rounded ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
            rows={6}
            placeholder="Comparte tus conocimientos..."
          />
        </div>

        <div className="mb-4">
          <TagSelector 
            selectedTags={tags} 
            onChange={setTags} 
          />
          {errors.tags && (
            <span className="text-red-500 text-xs">{errors.tags}</span>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
      type="submit"
      disabled={isSubmitting}
      className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
      ) : initialData ? 'Actualizar Post' : 'Publicar Post'}
    </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;