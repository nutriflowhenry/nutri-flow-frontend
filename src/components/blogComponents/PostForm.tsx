import React, { useState, useRef } from 'react';
import { Post, PostErrors, PostTag } from '@/types';
import TagSelector from './TagSelector';

interface PostFormProps {
  initialData?: Post;
  onSubmit: (data: { title: string; content: string; tags?: PostTag[]; image?: File }) => Promise<void>;
  onCancel: () => void;
  errors: PostErrors;
  isSubmitting?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, onCancel, errors, isSubmitting }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<PostTag[]>(initialData?.tags || []);
  const [selectedImage,] = useState<File | null>(null);
  

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file && !file.type.startsWith('image/')) {
  //     return;
  //   }
  //   setSelectedImage(file || null);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content, tags, image: selectedImage || undefined });
  };

  // const triggerFileInput = () => {
  //   fileInputRef.current?.click();
  // };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl w-full">
      <h2 className="text-2xl font-sora font-semibold text-[#242424] mb-4">
        {initialData ? 'Editar Post' : 'Crear Post'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-sora text-[#242424] font-semibold mb-2">
            Título
            {errors.title && (
              <span className="text-red-500 text-xs ml-2">{errors.title}</span>
            )}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 border rounded-full font-sora text-[#424242] ${
              errors.title ? 'border-red-500' : 'border-[#f0f0f0]'
            }`}
            placeholder="Escribe un título interesante"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-sora text-[#242424] font-semibold mb-2">
            Contenido
            {errors.content && (
              <span className="text-red-500 text-xs ml-2">{errors.content}</span>
            )}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full p-3 border rounded-2xl font-sora text-[#424242] ${
              errors.content ? 'border-red-500' : 'border-[#f0f0f0]'
            }`}
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
            <span className="text-red-500 text-xs font-sora">{errors.tags}</span>
          )}
        </div>

        {/* <div className="mb-6">
          <label className="block text-sm font-sora text-[#242424] font-semibold mb-2">
            Imagen del Post
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={triggerFileInput}
            className="px-4 py-2 bg-[#f0f0f0] text-[#424242] rounded-full font-sora hover:bg-[#e0e0e0] transition-colors"
          >
            {selectedImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
          </button>
          
          {selectedImage && (
            <p className="mt-2 text-sm text-[#424242] font-sora">
              {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
            </p>
          )}
        </div> */}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 drop-shadow-lg text-white rounded-full font-sora transition-all duration-100 hover:shadow-inner hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full font-sora transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978] ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Procesando...' : initialData ? 'Actualizar Post' : 'Publicar Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;