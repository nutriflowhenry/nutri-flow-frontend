'use client';

import { uploadMealImage } from '@/helpers/uploadImage';
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";

type FoodFormProps = {
    newFood: {
        name: string;
        description: string;
        calories: number;
        createdAt: string;
        image?: string;
    };
    setNewFood: React.Dispatch<
        React.SetStateAction<{
            name: string;
            description: string;
            calories: number;
            createdAt: string;
            image?: string;
        }>
    >;
    handleCreateFood: () => Promise<string | void>; // Devuelve el foodTrackerId
    closeModal: () => void;
    onImageUploaded?: (url: string) => void;
};

const FoodForm: React.FC<FoodFormProps> = ({
    newFood,
    setNewFood,
    handleCreateFood,
    closeModal,
    onImageUploaded,
}) => {
    const { userData } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewFood((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!imageFile) {
            console.error("Sube una imagen antes de crear la comida.");
            return;
        }

        if (!userData || !userData.token) {
            console.error("No tienes un token válido para subir la imagen. Inicia sesión nuevamente.");
            return;
        }

        setIsUploading(true);
        try {
            // 1. Crear el registro de comida y obtener el foodTrackerId
            const foodTrackerId = await handleCreateFood();

            if (!foodTrackerId) {
                throw new Error("No se pudo crear el registro de comida.");
            }

            // 2. Subir la imagen usando el foodTrackerId real
            const imageUrl = await uploadMealImage(foodTrackerId, imageFile, userData.token);

            // 3. Actualizar el estado con la URL de la imagen
            setNewFood((prev) => ({
                ...prev,
                image: imageUrl,
            }));

            // 4. Notificar al padre para actualización optimista
            if (typeof onImageUploaded === 'function') {
                onImageUploaded(imageUrl);
            }

            // Cerrar el modal sin recargar toda la lista
            closeModal();
        } catch (error) {
            console.error('Error al crear la comida o subir la imagen:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <label className="block my-3 text-sm text-gray-800 font-semibold">
                Nombre:
            </label>
            <input
                type="text"
                name="name"
                value={newFood.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-full text-gray-800"
            />

            <label className="block my-3 text-gray-800 text-sm font-semibold">
                Descripción:
            </label>
            <input
                type="text"
                name="description"
                value={newFood.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-full text-gray-800"
            />

            <label className="block my-3 text-sm text-gray-800 font-semibold">
                Calorías:
            </label>
            <input
                type="number"
                name="calories"
                value={newFood.calories}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-full text-gray-800"
            />

            <label className="block my-3 text-sm text-gray-800 font-semibold">
                Fecha: <span className="text-red-500">*</span>
            </label>
            <input
                type="date"
                name="createdAt"
                value={newFood.createdAt}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-full text-gray-800"
                required
            />

            {/* Campo para cargar la imagen */}
            <label className="block my-3 text-sm text-gray-800 font-semibold">
                Imagen de la comida:
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-full text-gray-800"
            />

            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-400 drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-gray-500"
                >
                    Cerrar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!imageFile || isUploading}
                    className="px-4 py-2 bg-[#9DC08B] drop-shadow-lg text-white rounded-full transition-all duration-100 hover:shadow-inner hover:bg-[#8BA978]"
                >
                    {isUploading ? 'Subiendo...' : 'Crear'}
                </button>
            </div>
        </div>
    );
};

export default FoodForm;