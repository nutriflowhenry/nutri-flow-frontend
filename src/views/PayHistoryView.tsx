'use client';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchUserPayments } from '@/helpers/auth.helper';

interface Purchase {
    id: string;
    created_at: string;
    status: string;
    canceled_at: string | null;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    stripeSubscriptionId: string;
}

const PayHistoryView = () => {
    const router = useRouter();
    const { userData } = useAuth();
    const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'canceled'>('all');

    // Obtener el historial de compras
    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            if (!userData?.token) return;

            try {
                const response = await fetchUserPayments(userData.token, currentPage, limit);
                setPurchaseHistory(response.data.result);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el historial de compras:', error);
                setError('Error al obtener el historial de compras. Inténtalo de nuevo.');
                setLoading(false);
            }
        };

        fetchPurchaseHistory();
    }, [userData?.token, currentPage, limit]);

    // Filtrar compras por estado
    const filteredPurchases = purchaseHistory.filter((purchase) => {
        if (filterStatus === 'all') return true;
        return purchase.status === filterStatus;
    });

    // Cambio página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Cambio límite de items por página
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1); // Reseteo a la primera página
    };

    if (loading) {
        return <p className="text-gray-700 text-center py-8">Cargando historial de compras...</p>;
    }

    if (error) {
        return <p className="text-gray-700 text-center py-8">{error}</p>;
    }

    return (
        <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-4 sm:mt-8">
            <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 mb-4 sm:mb-6"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Volver
            </button>
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black text-center">Historial de Compras</h1>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <label className="text-gray-700 text-sm sm:text-base">
                        <FontAwesomeIcon icon={faFilter} className="mr-2" />
                        Filtrar por estado:
                    </label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'canceled')}
                        className="p-2 border border-gray-300 rounded text-black text-sm sm:text-base"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activas</option>
                        <option value="canceled">Canceladas</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <label className="text-gray-700 text-sm sm:text-base">Items por página:</label>
                    <select
                        value={limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded text-black text-sm sm:text-base"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>

            {/* Tabla de compras */}
            {filteredPurchases.length > 0 ? (
                <div className="overflow-x-auto text-black">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-2 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">Fecha</th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">Estado</th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">Periodo</th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">ID</th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">Cancelada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPurchases.map((purchase) => (
                                <tr key={purchase.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-2 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                                        {new Date(purchase.created_at).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                                        <span
                                            className={`px-2 py-1 rounded ${
                                                purchase.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {purchase.status === 'active' ? 'Activa' : 'Cancelada'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                                        {new Date(purchase.currentPeriodStart).toLocaleDateString('es-ES')} -{' '}
                                        {new Date(purchase.currentPeriodEnd).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4 border-b text-sm sm:text-base">{purchase.stripeSubscriptionId}</td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                                        {purchase.canceled_at
                                            ? new Date(purchase.canceled_at).toLocaleDateString('es-ES')
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-700 text-center">No hay compras registradas.</p>
            )}

            {/* Paginación */}
            <div className="flex  flex-row justify-between items-center mt-4 sm:mt-6 space-y-4 sm:space-y-0">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-black p-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 text-sm sm:text-base"
                >
                    Anterior
                </button>
                <span className="text-gray-700 text-sm sm:text-base">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-black p-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 text-sm sm:text-base"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default PayHistoryView;