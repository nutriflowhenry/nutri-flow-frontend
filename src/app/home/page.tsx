'use client';

import { useState } from "react";
import CardList from "@/components/FoodEntriesCardList";
import FoodForm from "@/components/FoodForm";
import { createFoodTracker } from "@/helpers/foodEntriesHelper";
import Cookies from "js-cookie"; 
import CaloriesCounter from "@/components/caloriesCounter";

const Home = () => {
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
        console.log(atob(token.split(".")[1]))
        const response = await createFoodTracker(newFood, token);
        if (response) {
          setIsModalOpen(false); 
          setNewFood({
            name: "",
            description: "",
            calories: 0 ,
          }); 
        }
      } catch (error) {
        console.error("Error al crear la comida:", error);
      }
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center py-8">
      <h1 className="text-center text-3xl font-bold text-[#242424] font-sora">
        Bienvenido al Tracker de Comidas
      </h1>

      {token && <CaloriesCounter token={token} />} 

      <button
        onClick={openModal}
        className="mt-6 px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-lg shadow-md hover:bg-[#FF5252] transition-all duration-300"
      >
        Crear Nueva Comida
      </button>

      <div className="w-full max-w-4xl mt-6">
        <CardList />
      </div>

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
    </div>
  );
};

export default Home;