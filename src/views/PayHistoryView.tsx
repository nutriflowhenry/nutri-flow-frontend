'use client';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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

    // Obtener el historial de compras
    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            if (!userData?.token) return;

            try {
                const response = await fetchUserPayments(userData.token);
                setPurchaseHistory(response.data.result);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el historial de compras:', error);
                setError('Error al obtener el historial de compras. Inténtalo de nuevo.');
                setLoading(false);
            }
        };

        fetchPurchaseHistory();
    }, [userData?.token]);

    if (loading) {
        return <p className="text-gray-700 text-center py-8">Cargando historial de compras...</p>;
    }

    if (error) {
        return <p className="text-gray-700 text-center py-8">{error}</p>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-8">
            <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 mb-6"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Volver
            </button>
            <h1 className="text-2xl font-bold mb-6 text-black text-center">Historial de Compras</h1>
            {purchaseHistory.length > 0 ? (
                <div className="space-y-4">
                    {purchaseHistory.map((purchase) => (
                        <div key={purchase.id} className="p-4 border-b border-gray-200">
                            <p className="text-gray-700">
                                <strong>Fecha de creación:</strong>{" "}
                                {new Date(purchase.created_at).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            <p className="text-gray-700">
                                <strong>Estado:</strong>{" "}
                                {purchase.status === 'active' ? 'Activa' : 'Cancelada'}
                            </p>
                            <p className="text-gray-700">
                                <strong>Periodo actual:</strong>{" "}
                                {new Date(purchase.currentPeriodStart).toLocaleDateString('es-ES')} -{" "}
                                {new Date(purchase.currentPeriodEnd).toLocaleDateString('es-ES')}
                            </p>
                            <p className="text-gray-700">
                                <strong>ID de suscripción:</strong> {purchase.stripeSubscriptionId}
                            </p>
                            {purchase.canceled_at && (
                                <p className="text-gray-700">
                                    <strong>Cancelada el:</strong>{" "}
                                    {new Date(purchase.canceled_at).toLocaleDateString('es-ES')}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700 text-center">No hay compras registradas.</p>
            )}
            
        </div>
    );
};

export default PayHistoryView;