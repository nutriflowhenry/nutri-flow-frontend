'use client';

import { useState, useEffect, useRef } from 'react';
import { getDailyFoodTracker, updateFoodTracker } from '@/helpers/foodEntriesHelper';
import Cookies from 'js-cookie';
import { IFoodTracker } from '@/types';
import FoodEntriesCard from './FoodEntriesCard';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CardListProps {
  refreshTrigger?: number;
  currentDate: string;
  onRefresh: () => void;
  optimisticFood?: IFoodTracker | null;
}

const CardList = ({ refreshTrigger, currentDate, onRefresh, optimisticFood }: CardListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [foodEntries, setFoodEntries] = useState<IFoodTracker[]>([]);
  const [selectedFood, setSelectedFood] = useState<IFoodTracker | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCalories, setEditedCalories] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Obtener las entradas de comida al cambiar la fecha o el refreshTrigger
  useEffect(() => {
    const fetchFoodEntries = async () => {
      const token = Cookies.get('token');
      if (token) {
        setIsLoading(true);
        try {
          const data = await getDailyFoodTracker(currentDate, token);
          console.log("Food Entries Data:", data);

          if (data?.data?.results) {
            const activeFoodEntries = data.data.results.filter((entry: IFoodTracker) => entry.isActive);
            console.log('Registros activos:', activeFoodEntries);
            setFoodEntries(activeFoodEntries);
          }
        } catch (error) {
          console.error('Error al obtener los datos de la API:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFoodEntries();
  }, [refreshTrigger, currentDate]);

  // Polling para la card optimista
  useEffect(() => {
    if (optimisticFood) {
      // Iniciar polling
      pollingRef.current = setInterval(async () => {
        const token = Cookies.get('token');
        if (token) {
          try {
            const data = await getDailyFoodTracker(currentDate, token);
            if (data?.data?.results) {
              const activeFoodEntries = data.data.results.filter((entry: IFoodTracker) => entry.isActive);
              setFoodEntries(activeFoodEntries);
              // Si la comida real con imagen ya está, detener polling
              const existsWithImage = activeFoodEntries.some((e: IFoodTracker) =>
                e.name === optimisticFood.name &&
                e.calories === optimisticFood.calories &&
                e.createdAt.slice(0, 10) === optimisticFood.createdAt.slice(0, 10) &&
                !!e.image
              );
              if (existsWithImage && pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
            }
          } catch {
            // Ignorar errores de polling
          }
        }
      }, 2000);
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    }
  }, [optimisticFood, currentDate]);

  // Paginación
  let allEntries = foodEntries;
  // Si hay comida optimista, mantenerla hasta que la real esté en la lista
  if (optimisticFood && optimisticFood.createdAt.startsWith(currentDate.slice(0, 10))) {
    const existsInBackend = foodEntries.some(e =>
      e.name === optimisticFood.name &&
      e.calories === optimisticFood.calories &&
      e.createdAt.slice(0, 10) === optimisticFood.createdAt.slice(0, 10)
    );
    if (!existsInBackend) {
      allEntries = [optimisticFood, ...foodEntries.filter(e => e.id !== optimisticFood.id)];
    }
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allEntries.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(foodEntries.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Guardar cambios en la comida seleccionada
  const handleSaveChanges = async () => {
    if (selectedFood) {
      const updatedData = {
        name: editedName,
        description: editedDescription,
        calories: Number(editedCalories),
      };

      const token = Cookies.get('token');
      if (token) {
        try {
          const updatedFood = await updateFoodTracker(selectedFood.id, updatedData, token);
          setFoodEntries((prevEntries) =>
            prevEntries.map((entry) =>
              entry.id === selectedFood.id ? { ...entry, ...updatedFood } : entry
            )
          );
          setSelectedFood(null); // Cerrar el modal de edición
          onRefresh(); // Actualizar la lista si es necesario
        } catch (error) {
          console.error('Error al actualizar el food tracker:', error);
        }
      }
    }
  };

  // Desactivar (eliminar) una comida
  const handleDeactivate = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres desactivar este registro?')) {
      const token = Cookies.get('token');
      if (token) {
        const foodToDeactivate = foodEntries.find((entry) => entry.id === id);
        if (foodToDeactivate) {
          const updatedData = {
            name: foodToDeactivate.name,
            calories: foodToDeactivate.calories,
            description: foodToDeactivate.description || '',
            isActive: false,
          };

          try {
            await updateFoodTracker(id, updatedData, token);
            setFoodEntries((prevEntries) =>
              prevEntries.filter((entry) => entry.id !== id)
            );
            setSelectedFood(null); // Cerrar el modal de edición si estaba abierto
            onRefresh(); // Actualizar la lista si es necesario
          } catch (error) {
            console.error('Error al desactivar el food tracker:', error);
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Lista de tarjetas */}
      <div className="flex flex-wrap flex-col sm:flex-row justify-center gap-6">
        {isLoading ? (
          <p className='text-gray-600'>Cargando...</p>
        ) : currentItems.length > 0 ? (
          currentItems.map((foodEntry, idx) => (
            <div key={foodEntry.id}>
              <button
                onClick={() => {
                  setSelectedFood(foodEntry);
                  setEditedName(foodEntry.name);
                  setEditedDescription(foodEntry.description || '');
                  setEditedCalories(foodEntry.calories.toString());
                }}
                className={idx % 2 === 0 ? 'bg-[#f7f5ef]' : 'bg-white'}
              >
                <FoodEntriesCard {...foodEntry} />
              </button>
            </div>
          ))
        ) : (
          <p className='text-gray-600'>No hay registros en esta fecha</p>
        )}
      </div>

      {/* Paginación */}
      {foodEntries.length > itemsPerPage && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#B3B19C] drop-shadow-lg text-white rounded-full disabled:hidden"
          >
            Anterior
          </button>
          <span className="flex text-gray-800 items-center">
            Página {currentPage} de {Math.ceil(foodEntries.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(foodEntries.length / itemsPerPage)}
            className="px-4 py-2 bg-[#B3B19C] drop-shadow-lg text-white rounded-full disabled:hidden"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de edición */}
      {selectedFood && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 pb-12 rounded-3xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-sora text-[#242424] font-semibold">Editar Información</h2>

            <label className="block my-3 text-sm text-gray-600 font-semibold">Nombre:</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full p-2 border rounded-full text-black"
            />

            <label className="block my-3 text-sm text-gray-600 font-semibold">Descripción:</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded-3xl text-black"
            ></textarea>

            <label className="block my-3 text-sm text-gray-600 font-semibold">Calorías:</label>
            <input
              type="number"
              value={editedCalories}
              onChange={(e) => setEditedCalories(e.target.value)}
              className="w-full p-2 border rounded-full text-black"
            />

            <p className="text-sm text-gray-500 mt-2">
              Creado: {new Date(selectedFood.createdAt).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedFood(null)}
                className="px-4 py-2 bg-gray-400 drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-gray-500"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978]"
              >
                Guardar
              </button>
              <button
                onClick={() => handleDeactivate(selectedFood.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-red-600"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;