'use client';

import React from 'react';

type FoodFormProps = {
  newFood: {
    name: string;
    description: string;
    calories: number;
    createdAt: string; // Ahora es obligatorio
  };
  setNewFood: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      calories: number;
      createdAt: string; // Ahora es obligatorio
    }>
  >;
  handleCreateFood: () => void;
  closeModal: () => void;
};

const FoodForm: React.FC<FoodFormProps> = ({
  newFood,
  setNewFood,
  handleCreateFood,
  closeModal,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        required // Hacer el campo obligatorio
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-400 drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-gray-500"
        >
          Cerrar
        </button>
        <button
          onClick={handleCreateFood}
          className="px-4 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978]"
        >
          Crear
        </button>
      </div>
    </div>
  );
};

export default FoodForm;