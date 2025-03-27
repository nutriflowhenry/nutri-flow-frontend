'use client'
import { useAuth } from '@/context/AuthContext';
import { getAllPayments } from '@/helpers/admin.helper';
import { IUsersPayments } from '@/types';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'


const UsersPaymentsView = () => {

    const { userData } = useAuth();
    const [allPayments, setAllPayments] = useState<IUsersPayments>({
        data: [],
        pagination: {
            page: 1,
            limit: 10,
            totalpayments: 0,
            totalPages: 1
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!userData?.token) return;
            try {
                setIsLoading(true);

                const firstPage = await getAllPayments(userData.token, 1);
                const totalPages = firstPage.pagination.totalPages;

                const requests = [];
                for (let i = 2; i <= totalPages; i++) {
                    requests.push(getAllPayments(userData.token, i));
                }

                const responses = await Promise.all(requests);

                const allData = [firstPage, ...responses].flatMap(res => res.data);

                setAllPayments({
                    data: allData,
                    pagination: firstPage.pagination
                });

                setTotalPages(totalPages);
            } catch (error) {
                console.error("Error obteniendo pagos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [userData?.token]);

    const processedUsers = allPayments.data
        .sort((a, b) => {

            if (a.status !== b.status) return a.status === "active" ? -1 : 1;

            return a.user.name.localeCompare(b.user.name);
        })
        .filter((user) => {
            return filterStatus === "" || user.status === filterStatus;
        })
        .slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <div>
            {isLoading}
            {processedUsers.length >= 0 ? ( 
                <div>
                    <h1 className="text-2xl font-bold mb-4 mt-10 text-center">Historial de Transacciones</h1>
                    <div className="bg-gray-100 p-6 m-6 rounded-lg shadow-sm">
                        <div className="flex gap-2 mb-4 justify-center">
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border px-3 py-1 rounded-lg">
                                <option value="">Todos</option>
                                <option value="active">Activo</option>
                                <option value="canceled">Cancelado</option>
                            </select>
                        </div>

                        {/* tabla usuarios */}
                        <div className="relative overflow-x-auto shadow-md rounded-lg sm:rounded-lg">
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
                                        {processedUsers.map((payment) => (
                                            <tr key={payment.id} className="bg-white border-b border-gray-200 hover:bg-[#eeedeb73]">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    {payment.user.name}
                                                </th>
                                                <td className="px-6 py-2 flex items-center justify-center gap-2">
                                                    <span
                                                        className={`w-3 h-3 rounded-full  ${payment.status === "active" ? "bg-green-500" : "bg-red-500"
                                                            }`}>
                                                    </span>
                                                    {payment.status === "active" ? "Activo" : payment.status === "canceled" ? "Cancelado" : payment.status}</td>
                                                <td className="px-6 py-2 text-center">{payment.currentPeriodStart.split("T")[0]}</td>
                                                <td className="px-6 py-2 text-center">{payment.currentPeriodEnd.split("T")[0]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4 gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className={`px-4 py-2 mx-1 rounded flex items-center gap-2 
                                ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#eecb78] text-white hover:bg-[#cf9d52]'}`}>
                                <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                            </button>

                            <span className="px-4 py-2 bg-gray-200 rounded">{currentPage} de {totalPages}</span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className={`px-4 py-2 mx-1 rounded flex items-center gap-2 
                                ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#eecb78] text-white hover:bg-[#cf9d52]'}`}>
                                <FontAwesomeIcon icon={faArrowRight} className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (!isLoading && (
                <div className="text-black text-center">
                    <p></p>
                </div>
            )
            )}
        </div>
    )
}

export default UsersPaymentsView;