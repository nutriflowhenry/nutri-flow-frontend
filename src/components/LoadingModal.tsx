import React from 'react';


const LoadingModal = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-gray-700">Procesando pago...</p>
            </div>
        </div>
    );
};

export default LoadingModal;