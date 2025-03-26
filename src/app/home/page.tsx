'use client';

import { useState } from 'react';
import CardList from '@/components/FoodEntriesCardList';
import FoodForm from '@/components/FoodForm';
import { createFoodTracker } from '@/helpers/foodEntriesHelper';
import Cookies from 'js-cookie';
import CaloriesCounter from '@/components/caloriesCounter';
import AddFoodButton from '@/assets/AddFoodButton';
import WaterCounterView from '@/views/WaterCounterView';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const {isLoading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFood, setNewFood] = useState<{
    name: string;
    description: string;
    calories: number;
    createdAt: string;
    image?: string;
  }>({
    name: '',
    description: '',
    calories: 0,
    createdAt: new Date().toISOString().split('T')[0],
    image: '',
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

  // Función para refrescar la lista de comidas
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Incrementa el refreshTrigger para forzar la recarga
  };

  const handleCreateFood = async () => {
    if (token) {
      try {
        if (!newFood.createdAt) {
          console.error('La fecha es obligatoria.');
          return;
        }

        if (newFood.calories <= 0) {
          console.error('Las calorías deben ser mayores que 0.');
          return;
        }

        const adjustedFood = {
          ...newFood,
          createdAt: new Date(newFood.createdAt).toISOString(),
          image: newFood.image || null,
        };

        console.log('Enviando datos al backend para crear la comida:', adjustedFood);
        const response = await createFoodTracker(adjustedFood, token);
        console.log('Respuesta del backend al crear la comida:', response);

        if (response) {
          const { foodTracker } = response;
          const foodTrackerId = foodTracker.id; // Obtener el ID generado por el backend
          console.log('foodTrackerId obtenido:', foodTrackerId);

          setIsModalOpen(false);
          setNewFood({
            name: '',
            description: '',
            calories: 0,
            createdAt: new Date().toISOString().split('T')[0],
            image: '',
          });
          setCurrentDate(adjustedFood.createdAt);

          // Refrescar la lista de comidas
          handleRefresh();

          // Devolver el foodTrackerId para usarlo en la subida de la imagen
          return foodTrackerId;
        }
      } catch (error) {
        console.error('Error al crear la comida:', error);
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
        {/* Pasa onRefresh al componente CardList */}
        <CardList
          refreshTrigger={refreshTrigger}
          currentDate={currentDate}
          onRefresh={handleRefresh} // Aquí pasas la función handleRefresh
        />
      </div>


{!isLoading && (
            <>
      <div className="w-full max-w-4xl mt-6">
        <WaterCounterView />
      </div>
            
            </>)}


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