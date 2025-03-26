import { CommentErrors, PostErrors, PostTag } from '@/types';

export function validatePostForm(values: { 
  title: string; 
  content: string;
  tags?: PostTag[];
}): PostErrors {
  const errors: PostErrors = {};

  if (!values.title) {
    errors.title = "El título es requerido";
  } else if (values.title.length < 5 || values.title.length > 120) {
    errors.title = "El título debe tener entre 5 y 120 caracteres";
  }

  if (!values.content) {
    errors.content = "El contenido es requerido";
  } else if (values.content.length < 10 || values.content.length > 2000) {
    errors.content = "El contenido debe tener entre 10 y 2000 caracteres";
  }

  // Validación opcional para tags
  if (values.tags && values.tags.length > 5) {
    errors.tags = "Máximo 5 tags permitidos";
  }

  return errors;
}
  
  export function validateCommentForm(values: { 
    content: string 
  }): CommentErrors  {
    const errors: CommentErrors = {};
  
    if (!values.content) {
      errors.content = "El comentario es requerido";
    } else if (values.content.length < 10 || values.content.length > 500) {
      errors.content = "El comentario debe tener entre 10 y 500 caracteres";
    }
  
    return errors;
  }