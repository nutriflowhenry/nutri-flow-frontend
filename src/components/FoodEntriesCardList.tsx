'use client';
import { useState, useEffect } from 'react';
import { getDailyFoodTracker, deleteFoodTracker, updateFoodTracker } from '@/helpers/foodEntriesHelper';
import Cookies from 'js-cookie';
import { IFoodTracker } from '@/types';
import FoodEntriesCard from './FoodEntriesCard';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CardListProps {
  refreshTrigger?: number;
  currentDate: string;

  onRefresh: () => void;
}

const CardList = ({ refreshTrigger, currentDate, onRefresh }: CardListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [foodEntries, setFoodEntries] = useState<IFoodTracker[]>([]);
  const [selectedFood, setSelectedFood] = useState<IFoodTracker | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCalories, setEditedCalories] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Elementos por página

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoading(true);
      getDailyFoodTracker(currentDate, token)
        .then((data) => {
          if (data?.data?.results) {
            const activeFoodEntries = data.data.results.filter((entry: IFoodTracker) => entry.isActive);


            setFoodEntries(activeFoodEntries);

          }
        })
        .catch((error) => {
          console.error('Error al obtener los datos de la API:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [refreshTrigger, currentDate]);

  // Calcula los registros que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodEntries.slice(indexOfFirstItem, indexOfLastItem);

  // Cambia de página
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

  const handleSaveChanges = () => {
    if (selectedFood) {
      const updatedData = {
        name: editedName,
        description: editedDescription,
        calories: Number(editedCalories),
      };

      const token = Cookies.get('token');
      if (token) {
        updateFoodTracker(selectedFood.id, updatedData, token)
          .then((updatedFood) => {
            setFoodEntries((prevEntries) =>
              prevEntries.map((entry) =>
                entry.id === selectedFood.id ? updatedFood : entry
              )
            );
            setSelectedFood(null);
          })
          .catch((error) => {
            console.error('Error al actualizar el food tracker:', error);
          });
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      const token = Cookies.get('token');
      if (token) {
        deleteFoodTracker(id, token)
          .then(() => {
            setFoodEntries((prevEntries) =>
              prevEntries.filter((entry) => entry.id !== id)
            );
            setSelectedFood(null);
            onRefresh(); // Llama a onRefresh para incrementar refreshTrigger
          })
          .catch((error) => {
            console.error('Error al eliminar el food tracker:', error);
          });
      }
    }
  };
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-6">
        {isLoading ? (
          <p className='text-gray-600'>Cargando...</p>
        ) : currentItems.length > 0 ? (
          currentItems.map((foodEntry) => (
            <button key={foodEntry.id} onClick={() => setSelectedFood(foodEntry)}>
              <FoodEntriesCard key={foodEntry.id} {...foodEntry} />
            </button>
          ))
        ) : (
          <p className='text-gray-600'>No hay registros en esta fecha</p>
        )}
      </div>

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

      {selectedFood && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 pb-12 rounded-3xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-sora text-[#242424] font-semibold">Editar Información</h2>

            <label className="block my-3 text-sm text-gray-600 font-semibold">Nombre:</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full p-2 border rounded-full"
            />

            <label className="block my-3 text-sm text-gray-600 font-semibold">Descripción:</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded-3xl"
            ></textarea>

            <label className="block my-3 text-sm text-gray-600 font-semibold">Calorías:</label>
            <input
              type="number"
              value={editedCalories}
              onChange={(e) => setEditedCalories(e.target.value)}
              className="w-full p-2 border rounded-full"
            />

            <p className="text-sm text-gray-500 mt-2">Creado: {new Date(selectedFood.createdAt).toLocaleDateString()}</p>

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
                onClick={() => handleDelete(selectedFood.id)}
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