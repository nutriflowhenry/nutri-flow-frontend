'use client';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilter, faReceipt } from '@fortawesome/free-solid-svg-icons';
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
        return <p className="text-gray-700 text-center py-8 font-sora">Cargando historial de compras...</p>;
    }

    if (error) {
        return <p className="text-gray-700 text-center py-8">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-[#F4EAE0] py-8 px-4 sm:px-6 font-sora">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[#6b8f71] hover:text-[#5a7c62] mb-4 sm:mb-0"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        <span>Volver al perfil</span>
                    </button>

                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#5a5f52] flex items-center justify-center sm:justify-start">
                            <FontAwesomeIcon icon={faReceipt} className="mr-3 text-[#CEB58D]" />
                            Historial de Pagos
                        </h1>
                        <p className="text-[#7A8B5C] mt-1">Revisa todas tus transacciones</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faFilter} className="text-[#CEB58D] mr-3" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'canceled')}
                                className="bg-[#F4EAE0] border border-[#E7E3D8] rounded-lg px-4 py-2 text-[#5a5f52] focus:outline-none focus:ring-2 focus:ring-[#CEB58D]"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="active">Activas</option>
                                <option value="canceled">Canceladas</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <span className="text-[#5a5f52] mr-3">Mostrar:</span>
                            <select
                                value={limit}
                                onChange={(e) => handleLimitChange(Number(e.target.value))}
                                className="bg-[#F4EAE0] border border-[#E7E3D8] rounded-lg px-4 py-2 text-[#5a5f52] focus:outline-none focus:ring-2 focus:ring-[#CEB58D]"
                            >
                                <option value="5">5 items</option>
                                <option value="10">10 items</option>
                                <option value="20">20 items</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de compras */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredPurchases.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-[#F4EAE0]">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#5a5f52]">Fecha</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#5a5f52]">Estado</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#5a5f52]">Periodo</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#5a5f52]">ID de Transacción</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#5a5f52]">Cancelación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E7E3D8]">
                                {filteredPurchases.map((purchase) => (
                                    <tr key={purchase.id} className="hover:bg-[#FFF6EA] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5a5f52]">
                                            {new Date(purchase.created_at).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${purchase.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {purchase.status === 'active' ? 'Activa' : 'Cancelada'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5a5f52]">
                                            {new Date(purchase.currentPeriodStart).toLocaleDateString('es-ES')} -{' '}
                                            {new Date(purchase.currentPeriodEnd).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5a5f52] font-mono">{purchase.stripeSubscriptionId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5a5f52]">
                                            {purchase.canceled_at
                                                ? new Date(purchase.canceled_at).toLocaleDateString('es-ES')
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                            <div className="inline-block bg-[#F4EAE0] p-4 rounded-full mb-4">
                                <FontAwesomeIcon icon={faReceipt} className="text-2xl text-[#CEB58D]" />
                            </div>
                            <h3 className="text-lg font-medium text-[#5a5f52]">No hay transacciones registradas</h3>
                            <p className="text-[#7A8B5C] mt-1">Cuando realices un pago, aparecerá aquí</p>
                        </div>
                )}

                {/* Paginación */}
                <div className="bg-[#F4EAE0] px-6 py-4 flex items-center justify-between border-t border-[#E7E3D8]">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'text-gray-400' : 'text-[#6b8f71] hover:bg-[#E6F0D9]'}`}
                    >
                        Anterior
                    </button>
                    <div className="flex items-center space-x-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-full ${currentPage === page ? 'bg-[#6b8f71] text-white' : 'text-[#5a5f52] hover:bg-[#E6F0D9]'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400' : 'text-[#6b8f71] hover:bg-[#E6F0D9]'}`}
                    >
                        Siguiente
                    </button>
                </div>
                </div>

            </div>
        </div>
    );
};

export default PayHistoryView;