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

    if (!newFood.name) {
      alert("El nombre de la comida es obligatorio.");
      return;
    }

    if (!userData || !userData.token) {
      alert("No tienes un token válido para subir la imagen. Inicia sesión nuevamente.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Crear el registro de comida primero
      console.log('Creando registro de comida...'); // Depuración
      const foodTrackerId = await handleCreateFood(); // Crear la comida sin imagen
      console.log('foodTrackerId recibido:', foodTrackerId); // Depuración

      if (!foodTrackerId) {
        throw new Error("No se pudo obtener el ID del registro de comida.");
      }

      // 2. Subir la imagen con el foodTrackerId correcto
      console.log('Subiendo imagen...'); // Depuración
      const imageUrl = await uploadMealImage(foodTrackerId, imageFile, userData.token);
      console.log('Imagen subida con éxito. URL:', imageUrl); // Depuración

      // 3. Actualizar el registro de comida con la URL de la imagen
      const updatedFood = {
        ...newFood,
        imageUrl: imageUrl,
      };
      await handleCreateFood(imageUrl); // Actualizar la comida con la URL de la imagen

      // 4. Actualizar el estado con la URL de la imagen
      setNewFood((prev) => ({ ...prev, imageUrl }));
      alert('Imagen subida con éxito');

      // 5. Cerrar el modal y refrescar la lista de comidas
      closeModal();
      onRefresh(); // Llama a onRefresh para actualizar la lista de comidas
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
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
        <button
          onClick={() => handleCreateFood(newFood.imageUrl)} // Pasa imageUrl como parámetro
          className="px-4 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978]"
        >
          Crear
        </button>
      </div>
    </div>
  );
};

export default FoodForm;