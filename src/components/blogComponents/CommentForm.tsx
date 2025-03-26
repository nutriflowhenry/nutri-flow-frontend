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

  // Sincronizar errores externos
  useEffect(() => {
    if (errors.content) {
      setLocalErrors(errors);
    }
  }, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación local
    const validationErrors = validateCommentForm({ content });
    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    // Limpiar errores y enviar
    setLocalErrors({});
    onSubmit({ content });
    setContent('');
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Añadir comentario
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              // Limpiar error al escribir
              if (localErrors.content) setLocalErrors({});
            }}
            className={`mt-1 block w-full border ${
              localErrors.content ? 'border-red-500' : 'border-gray-300'
            } rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500`}
            rows={3}
            placeholder="Escribe tu comentario..."
            disabled={isSubmitting}
          />
          {localErrors.content && (
            <p className="mt-1 text-sm text-red-500">{localErrors.content}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
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