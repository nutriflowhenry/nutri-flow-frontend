import React, { useState, useEffect } from 'react';
import { CommentErrors } from '@/types';
import { validateCommentForm } from '@/helpers/blogHelpers/blogValidations';

interface CommentFormProps {
  onSubmit: (commentData: { content: string }) => void;
  isSubmitting?: boolean;
  errors?: CommentErrors;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  onSubmit, 
  isSubmitting = false,
  errors = {}
}) => {
  const [content, setContent] = useState('');
  const [localErrors, setLocalErrors] = useState<CommentErrors>({});

  
  useEffect(() => {
    if (errors.content) {
      setLocalErrors(errors);
    }
  }, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const validationErrors = validateCommentForm({ content });
    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    
    setLocalErrors({});
    onSubmit({ content });
    setContent('');
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-sora font-semibold text-[#424242] mb-2">
            Añadir comentario
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (localErrors.content) setLocalErrors({});
            }}
            className={`w-full p-3 border font-sora text-[#424242] ${
              localErrors.content 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-[#e0e0e0] focus:border-[#9DC08B]'
            } rounded-xl shadow-sm focus:ring-1 focus:ring-[#9DC08B]`}
            rows={3}
            placeholder="Escribe tu comentario..."
            disabled={isSubmitting}
          />
          {localErrors.content && (
            <p className="mt-1 text-sm text-red-500 font-sora">{localErrors.content}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full font-sora transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978] ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Publicando...' : 'Publicar comentario'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;