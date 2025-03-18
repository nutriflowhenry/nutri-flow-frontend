import { useAuth } from '@/context/AuthContext';
import { banUser, getAllUsers } from '@/helpers/admin.helper';
import { IUsers } from '@/types';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const UsersList = () => {

    const { userData } = useAuth();
    const [allUsers, setAllUsers] = useState<IUsers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!userData?.token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const usersTable = await getAllUsers(userData?.token)
                setAllUsers(usersTable || []);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userData?.token]);

    const handleBanUser = async (id: string) => {
        if (userData?.token) {
            await banUser(userData?.token, id)

            setAllUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, isActive: !user.isActive } : user
                )
            );
            Swal.fire({
                title: '¡Éxito!',
                text: 'La cuenta del usuario ha sido suspedida',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div>
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : allUsers.length  >= 0? (
                <div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">

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
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                Tipo de suscripcion
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                Estado
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers?.map((user: IUsers) => (
                                            <tr key={user.id} className="bg-white border-b border-gray-200 hover:bg-[#eeedeb73]">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    {user.name}
                                                </th>
                                                <td className="px-6 py-2">{user.email}</td>
                                                <td className="px-6 py-2 text-center">{user.subscriptionType}</td>
                                                <td className="px-6 py-2 flex items-center gap-3">
                                                    <span
                                                        className={`w-3 h-3 rounded-full  ${user.isActive ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    ></span>
                                                    {user.role !== "admin" && (
                                                        <button onClick={() => handleBanUser(user.id)}
                                                            className="text-white px-4 py-1 rounded bg-[#e7c46b] hover:bg-[#d4b058] w-[100px] text-center">
                                                            {user.isActive ? "Suspender" : "Restaurar"}
                                                        </button>
                                                    )}
                                                </td>
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
                    <p>No se encontraron usuarios registrados</p>
                </div>
            )}
        </div>
    )
}

export default UsersList;