'use client';

import { useState, useEffect } from "react";
import { createFoodTracker, getDailyCalories, getDailyFoodTracker, deleteFoodTracker, updateFoodTracker } from "@/helpers/foodEntriesHelper";
import Cookies from 'js-cookie'; // Importa js-cookie
import { IFoodTracker } from "@/types";
import FoodEntriesCard from "./FoodEntriesCard";

const CardList = () => {
  const [foodEntries, setFoodEntries] = useState<IFoodTracker[]>([]);
  const [selectedFood, setSelectedFood] = useState<IFoodTracker | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCalories, setEditedCalories] = useState("");

  // Cargar los datos de los "food trackers" desde la API
  useEffect(() => {
    const token = Cookies.get("token"); // Obtener el token desde las cookies
    if (token) {
      const date = new Date().toISOString().split('T')[0]; // Fecha de hoy
      getDailyFoodTracker(date, token).then((data) => {
        if (data) {
          setFoodEntries(data); // Asumiendo que la respuesta tiene la forma correcta
        }
      }).catch((error) => {
        console.error("Error al obtener los datos de la API:", error);
      });
    }
  }, []);

  // Guardar cambios en el "food tracker" usando la API
  const handleSaveChanges = () => {
    if (selectedFood) {
      const updatedData = {
        name: editedName,
        description: editedDescription,
        calories: Number(editedCalories),
      };

      const token = Cookies.get("token"); // Obtener el token desde las cookies
      if (token) {
        updateFoodTracker(selectedFood.id, updatedData, token)
          .then((updatedFood) => {
            setFoodEntries((prevEntries) =>
              prevEntries.map((entry) =>
                entry.id === selectedFood.id ? updatedFood : entry
              )
            );
            setSelectedFood(null); // Cerrar el modal después de guardar
          })
          .catch((error) => {
            console.error("Error al actualizar el food tracker:", error);
          });
      }
    }
  };

  // Eliminar el "food tracker" usando la API
  const handleDelete = (id: string) => {
    const token = Cookies.get("token"); // Obtener el token desde las cookies
    if (token) {
      deleteFoodTracker(id, token)
        .then(() => {
          setFoodEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
          setSelectedFood(null); // Cerrar el modal después de eliminar
        })
        .catch((error) => {
          console.error("Error al eliminar el food tracker:", error);
        });
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {foodEntries.map((foodEntrie) => (
        <button
          key={foodEntrie.id}
          onClick={() => setSelectedFood(foodEntrie)}
          className="focus:outline-none"
        >
          <FoodEntriesCard {...foodEntrie} />
        </button>
      ))}

      {selectedFood && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 pb-12 rounded-3xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-sora text-[#242424] font-semibold">Editar Información</h2>

            <label className="block mt-3 text-sm font-semibold">Nombre:</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <label className="block mt-3 text-sm font-semibold">Descripción:</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded"
            ></textarea>

            <label className="block mt-3 text-sm font-semibold">Calorías:</label>
            <input
              type="number"
              value={editedCalories}
              onChange={(e) => setEditedCalories(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <p className="text-sm text-gray-500 mt-2">Creado: {new Date(selectedFood.createdAt).toLocaleDateString()}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedFood(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => handleDelete(selectedFood.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;
