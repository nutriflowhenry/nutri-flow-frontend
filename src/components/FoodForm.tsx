'use client';

import { uploadMealImage } from '@/helpers/uploadImage';
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";

type FoodFormProps = {
  newFood: {
    name: string;
    description: string;
    calories: number;
    createdAt: string;
    imageUrl?: string;
  };
  setNewFood: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      calories: number;
      createdAt: string;
      imageUrl?: string;
    }>
  >;
  handleCreateFood: (imageUrl?: string) => Promise<string | void>; // Acepta imageUrl como parámetro
  closeModal: () => void;
  onRefresh: () => void; // Función para refrescar la lista de comidas
};

const FoodForm: React.FC<FoodFormProps> = ({
  newFood,
  setNewFood,
  handleCreateFood,
  closeModal,
  onRefresh,
}) => {
  const { userData, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Selecciona una imagen antes de subir.");
      return;
    }
  
    if (!userData || !userData.token) {
      alert("No tienes un token válido para subir la imagen. Inicia sesión nuevamente.");
      return;
    }
  
    setIsUploading(true);
    try {
      console.log('Subiendo imagen antes de crear la comida...');
      const foodTrackerId = crypto.randomUUID(); // Generar un ID temporal
      const imageUrl = await uploadMealImage(foodTrackerId, imageFile, userData.token);
      console.log('Imagen subida. URL:', imageUrl);
  
      setNewFood((prev) => ({
        ...prev,
        imageUrl, // Guardar la URL de la imagen antes de crear la comida
      }));
      
      alert('Imagen subida con éxito');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!newFood.imageUrl) {
      alert("Sube una imagen antes de crear la comida.");
      return;
    }
  
    await handleCreateFood(newFood.imageUrl);
    closeModal();
    onRefresh();
  };
  

  return (
    <div>
      <label className="block my-3 text-sm text-gray-800 font-semibold">
        Nombre:
      </label>
      <input
        type="text"
        name="name"
        value={newFood.name}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-full text-gray-800"
      />

      <label className="block my-3 text-gray-800 text-sm font-semibold">
        Descripción:
      </label>
      <input
        type="text"
        name="description"
        value={newFood.description}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-full text-gray-800"
      />

      <label className="block my-3 text-sm text-gray-800 font-semibold">
        Calorías:
      </label>
      <input
        type="number"
        name="calories"
        value={newFood.calories}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-full text-gray-800"
      />

      <label className="block my-3 text-sm text-gray-800 font-semibold">
        Fecha: <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        name="createdAt"
        value={newFood.createdAt}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-full text-gray-800"
        required
      />

      {/* Campo para cargar la imagen */}
      <label className="block my-3 text-sm text-gray-800 font-semibold">
        Imagen de la comida:
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border rounded-full text-gray-800"
      />
      <button
        type="button"
        onClick={handleUploadImage}
        disabled={!imageFile || isUploading}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full disabled:bg-gray-400"
      >
        {isUploading ? 'Subiendo...' : 'Subir Imagen'}
      </button>

      {/* Mostrar la imagen subida (opcional) */}
      {newFood.imageUrl && (
        <div className="mt-4">
          <img
            src={newFood.imageUrl}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-400 drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-gray-500"
        >
          Cerrar
        </button>
        <button onClick={() => handleCreateFood(newFood.imageUrl)}
          className="px-4 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978]"
        >
          Crear
        </button>
      </div>
    </div>
  );
};

export default FoodForm;