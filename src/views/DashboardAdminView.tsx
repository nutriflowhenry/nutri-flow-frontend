'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';


const DashboardAdminView = () => {
    const { userData, userProfile, logout } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userData) {
            setLoading(false);
        } else {
            setLoading(false);

        }
    }, [userData]);

    if (loading) {
      return <p className="text-gray-700 text-center py-8">Cargando...</p>;
  }

return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6 text-black text-center">Administrador Nutriflow</h1>
            {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-black text-center">
                    <p>No se encontraron datos del usuario.</p>
                </div>
            )}

        </div>
    );
};

export default DashboardAdminView;