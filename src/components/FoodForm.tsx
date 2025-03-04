import React from "react";

type FoodFormProps = {
  newFood: {
    name: string;
    description: string;
    calories: number;
  };
  setNewFood: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    calories: number;
  }>>;
  handleCreateFood: () => void;
  closeModal: () => void;
};

const FoodForm: React.FC<FoodFormProps> = ({ newFood, setNewFood, handleCreateFood, closeModal }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <label className="block mt-3 text-sm font-semibold">Nombre:</label>
      <input
        type="text"
        name="name"
        value={newFood.name}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />

      <label className="block mt-3 text-sm font-semibold">Descripción:</label>
      <input
        type="text"
        name="description"
        value={newFood.description}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />

      <label className="block mt-3 text-sm font-semibold">Calorías:</label>
      <input
        type="number"
        name="calories"
        value={newFood.calories}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cerrar
        </button>
        <button
          onClick={handleCreateFood}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Crear
        </button>
      </div>
    </div>
  );
};

export default FoodForm;
