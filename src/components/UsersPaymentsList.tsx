import { useAuth } from '@/context/AuthContext';
import { getAllPayments} from '@/helpers/admin.helper';
import { IUsersPayments } from '@/types';
import React, { useEffect, useState } from 'react'

const UsersPaymentsList = () => {

    const { userData } = useAuth();
    const [allPayments, setAllPayments] = useState<IUsersPayments>({ data: [] });
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            if (!userData?.token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const paymentsData = await getAllPayments(userData?.token)
                setAllPayments(paymentsData);
            } catch (error) {
                console.error("Error al obtener pagos de los usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userData?.token]);

    const filteredUsers = allPayments.data.filter((user) => {
        const matchesStatus = filterStatus === "" || user.status === filterStatus;
        return matchesStatus;
    });

    return (
        <div>
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : allPayments?.data.length  >= 0? (
                <div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">

                        <div className="flex gap-2 mb-4 justify-center">
                                <select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="border px-3 py-1 rounded-lg">
                                    <option value="">Todos</option>
                                    <option value="active">Activo</option>
                                    <option value="canceled">Cancelado</option>
                                </select>
                        </div>        

                        {/* tabla usuarios */}
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-[#b9c4a4]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                Nombre
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                Estado suscripcion
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                Inicia
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                Finaliza
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers?.map((payment) => (
                                            <tr key={payment.id} className="bg-white border-b border-gray-200 hover:bg-[#eeedeb73]">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    {payment.user.name}
                                                </th>
                                                <td className="px-6 py-2 text-center">{payment.status}</td>
                                                <td className="px-6 py-2 text-center">{payment.currentPeriodStart}</td>
                                                <td className="px-6 py-2 text-center">{payment.currentPeriodEnd}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-black text-center">
                    <p>No se encontro informacion sobre subscripciones</p>
                </div>
            )}
        </div>
    )
}

export default UsersPaymentsList;