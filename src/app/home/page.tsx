'use client';

import { useState, useEffect } from 'react';
import CardList from '@/components/FoodEntriesCardList';
import FoodForm from '@/components/FoodForm';
import { createFoodTracker } from '@/helpers/foodEntriesHelper';
import Cookies from 'js-cookie';
import CaloriesCounter from '@/components/caloriesCounter';
import AddFoodButton from '@/assets/AddFoodButton';
import WaterCounterView from '@/views/WaterCounterView';
import { useAuth } from '@/context/AuthContext';
import Tutorial from '@/components/Tutorial';
import { IFoodTracker } from '@/types';
import { motion } from 'framer-motion';

const Home = () => {
  const { isLoading, userData } = useAuth();
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
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const token = Cookies.get('token');

  // Verificar si es un usuario nuevo al cargar el componente
  useEffect(() => {
    if (userData) {
      const userTutorialKey = `tutorialCompleted_${userData.user.id}`;
      const isNewUser = localStorage.getItem(userTutorialKey) !== 'true';
      if (isNewUser) {
        setShowTutorial(true);
      }
    }
    
  }, [userData]);


  const tutorialSteps = [
    {
      title: "¡Bienvenido a NutriFlow!",
      content: "Te guiaré para que aproveches al máximo tu experiencia de seguimiento nutricional.",
      position: "center",
      target: null
    },
    {
      title: "Contador de Calorías",
      content: "Aquí verás tu progreso diario de calorías consumidas.",
      position: "top",
      target: "calories-counter"
    },
    {
      title: "Registro de Comidas",
      content: "Tus comidas del día aparecerán aquí. Puedes agregar nuevas con el botón flotante.",
      position: "left",
      target: "food-list"
    },
    {
      title: "Control de Hidratación",
      content: "Registra cada vaso de agua que tomes para mantenerte hidratado durante el día.",
      position: "right",
      target: "water-counter"
    },
    {
      title: "¡Listo para empezar!",
      content: "Haz clic en el botón + para agregar tu primera comida y comenzar tu registro.",
      position: "bottom",
      target: "add-food-button"
    }
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Función para refrescar la lista de comidas
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Incrementa el refreshTrigger para forzar la recarga
  };

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      if (userData) {
        const userTutorialKey = `tutorialCompleted_${userData.user.id}`;
        localStorage.setItem(userTutorialKey, 'true');
      }
    }
  
  };

  const handleSkipTutorial = () => {
    if (userData) {
      const userTutorialKey = `tutorialCompleted_${userData.user.id}`;
      setShowTutorial(false);
      localStorage.setItem(userTutorialKey, 'true');
    }
    
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
      <Tutorial
        showTutorial={showTutorial}
        currentStep={currentStep}
        tutorialSteps={tutorialSteps}
        handleNextStep={handleNextStep}
        handleSkipTutorial={handleSkipTutorial}
      />
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
            <WaterCounterView currentDate={new Date().toISOString().split('T')[0]} />
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