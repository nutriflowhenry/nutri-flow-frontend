'use client';

import { useState } from 'react';
import CardList from '@/components/FoodEntriesCardList';
import FoodForm from '@/components/FoodForm';
import { createFoodTracker } from '@/helpers/foodEntriesHelper';
import Cookies from 'js-cookie';
import CaloriesCounter from '@/components/caloriesCounter';
import AddFoodButton from '@/assets/AddFoodButton';
import WaterCounterView from '@/views/WaterCounterView';

const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFood, setNewFood] = useState<{
    name: string;
    description: string;
    calories: number;
    createdAt: string;
    imageUrl?: string;
  }>({
    name: '',
    description: '',
    calories: 0,
    createdAt: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });
  const [currentDate, setCurrentDate] = useState<string>(() => {
    const now = new Date();
    const midnightUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    return midnightUTC.toISOString();
  });

  const token = Cookies.get('token');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateFood = async (imageUrl?: string) => {
    if (token) {
      try {
        if (!newFood.createdAt) {
          alert('La fecha es obligatoria.');
          return;
        }

        if (newFood.calories <= 0) {
          alert('Las calorías deben ser mayores que 0.');
          return;
        }

        const adjustedFood = {
          ...newFood,
          createdAt: new Date(newFood.createdAt).toISOString(),
          imageUrl: imageUrl || null, // Usar la URL de la imagen si está disponible
        };

        console.log('Enviando datos al backend:', adjustedFood); // Depuración
        const response = await createFoodTracker(adjustedFood, token);
        console.log('Respuesta del backend:', response); // Depuración

        if (response) {
          const { foodTracker } = response; // Extraer el objeto foodTracker
          const foodTrackerId = foodTracker.id; // Extraer el ID del registro creado
          console.log('foodTrackerId obtenido:', foodTrackerId); // Depuración

          setIsModalOpen(false);
          setNewFood({
            name: '',
            description: '',
            calories: 0,
            createdAt: new Date().toISOString().split('T')[0],
            imageUrl: '',
          });
          setCurrentDate(adjustedFood.createdAt);
          setRefreshTrigger((prev) => prev + 1);

          // Devolver el foodTrackerId para usarlo en la subida de la imagen
          return foodTrackerId;
        }
      } catch (error) {
        console.error('Error al crear la comida:', error);
        alert(
          error instanceof Error
            ? error.message
            : 'Hubo un error al crear la comida.'
        );
      }
    }
  };

  return (
    <div className="font-sora flex flex-col items-center py-8 relative">
      <h1 className="text-center text-3xl font-bold text-[#242424] font-sora">
        Bienvenido al Tracker de Comidas
      </h1>

      {token && (
        <CaloriesCounter
          token={token}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          refreshTrigger={refreshTrigger}
        />
      )}

      <div className="w-full max-w-4xl mt-6">
        <CardList
          refreshTrigger={refreshTrigger}
          currentDate={currentDate}
          onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </div>

      <div className="w-full max-w-4xl mt-6">
        <WaterCounterView />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 pb-12 rounded-3xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-[#242424] font-sora">
              Crear Nueva Comida
            </h2>

            <FoodForm
              newFood={newFood}
              setNewFood={setNewFood}
              handleCreateFood={handleCreateFood}
              closeModal={closeModal}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)} // Pasar la función onRefresh
            />
          </div>
        </div>
      )}

      <button
        onClick={openModal}
        className="fixed mb-24 bottom-[0px] right-[0px] flex justify-center items-center w-[100px] h-[100px] overflow-visible"
      >
        <AddFoodButton />
      </button>
    </div>
  );
};

export default Home;