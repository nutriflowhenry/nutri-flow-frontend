'use client';

import { useState } from "react";
import CardList from "@/components/FoodEntriesCardList";
import FoodForm from "@/components/FoodForm";
import { createFoodTracker } from "@/helpers/foodEntriesHelper";
import Cookies from "js-cookie"; 
import CaloriesCounter from "@/components/caloriesCounter";
import AddFoodButton from "@/assets/AddFoodButton";

const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    description: "",
    calories: 0 ,
  });

  const token = Cookies.get("token");

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleCreateFood = async () => {
    if (token) {
      try {
        
        const response = await createFoodTracker(newFood, token);
        if (response) {
          setIsModalOpen(false); 
          setNewFood({
            name: "",
            description: "",
            calories: 0 ,
          }); 
          setRefreshTrigger(prev => prev + 1);
        }
      } catch (error) {
        console.error("Error al crear la comida:", error);
      }
    }
  };

  return (
    <div className="font-sora flex flex-col items-center py-8 relative">
  {/* El contenido principal de la página */}
  <h1 className="text-center text-3xl font-bold text-[#242424] font-sora">
    Bienvenido al Tracker de Comidas
  </h1>

  {token && <CaloriesCounter token={token} />} 

  <div className="w-full max-w-4xl mt-6">
    <CardList refreshTrigger={refreshTrigger}/>
  </div>

  {/* Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 pb-12 rounded-3xl shadow-2xl max-w-md w-full relative">
        <button 
          onClick={closeModal} 
          className="absolute top-3 right-3  text-gray-500 hover:text-gray-800 text-xl"
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

  {/* Asegúrate de que este botón esté fuera del flujo normal */}
 
  {/* Cambia <AddFoodButton /> a un div o span */}
  <button 
  onClick={openModal}
  className="fixed mb-24 bottom-[0px] right-[0px] flex justify-center items-center w-[100px] h-[100px] overflow-visible">
    <AddFoodButton />
  </button>





</div>

  );
};

export default Home