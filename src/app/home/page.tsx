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
import { IFoodTracker } from '@/types';
import { motion } from 'framer-motion';

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
  const [optimisticFood, setOptimisticFood] = useState<IFoodTracker | null>(null);

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

        const response = await createFoodTracker(adjustedFood, token);
        if (response) {
          setIsModalOpen(false);
          setNewFood({
            name: '',
            description: '',
            calories: 0,
            createdAt: new Date().toISOString().split('T')[0],
            image: '',
          });
          setCurrentDate(adjustedFood.createdAt);
          handleRefresh();
          return response.foodTracker.id;
        }
      } catch (error) {
        setOptimisticFood(null);
        console.error('Error al crear la comida:', error);
      }
    }
  };

  // Refrescar la lista solo después de que la imagen esté subida
  const updateOptimisticFoodImage = () => {
    handleRefresh();
  };

  return (
    <div className="font-sora flex flex-col items-center py-8 relative">
      <motion.h1 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="mt-8 text-center text-2xl md:text-4xl font-extrabold text-[#9BA783] font-sora mb-2 flex items-center justify-center gap-3"
      >
        <span role="img" aria-label="comida" className='hidden md:inline'>🥗</span>
        Bienvenido al Tracker de Comidas
      </motion.h1>
      <div className="flex justify-center mb-8">
        <div className="h-1 w-24 bg-[#CEB58D] rounded-full"></div>
      </div>

      {token && (
        <CaloriesCounter
          token={token}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          refreshTrigger={refreshTrigger}
        />
      )}

      <div className="w-full max-w-4xl mt-12">
        {/* Pasa onRefresh al componente CardList */}
        <CardList
          refreshTrigger={refreshTrigger}
          currentDate={currentDate}
          onRefresh={handleRefresh}
          optimisticFood={optimisticFood}
        />
      </div>


{!isLoading && (
            <>
      <div className="w-full max-w-4xl mt-6">
        <WaterCounterView currentDate={currentDate} />
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
              onImageUploaded={updateOptimisticFoodImage}
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