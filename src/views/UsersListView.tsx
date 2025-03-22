'use client';
import { useAuth } from '@/context/AuthContext';
import { activateUser, banUser, getAllUsers } from '@/helpers/admin.helper';
import { IUsers } from '@/types';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const UsersListView = () => {

    const { userData } = useAuth();
    const [allUsers, setAllUsers] = useState<IUsers[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState(""); 
    const [filterSubscription, setFilterSubscription] = useState(""); 
    const [filterEmail, setFilterEmail] = useState("");    

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

    const handleUserStatus = async (id: string, isActive: boolean) => {
        if (userData?.token) {
            if (isActive) {
                await banUser(userData?.token, id);
            } else {
                await activateUser(userData?.token, id);
            }
    
            setAllUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, isActive: isActive ? false : true } : user
                )
            );
            Swal.fire({
                title: '¡Éxito!',
                text: isActive ? 'La cuenta del usuario ha sido suspendida' : 'La cuenta del usuario ha sido activada',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            
        }
    };

    const filteredUsers = allUsers.filter((user) => {
        const matchesStatus = filterStatus === "" || (filterStatus === "activo" ? user.isActive : !user.isActive);
        const matchesSubscription = filterSubscription === "" || user.subscriptionType.includes(filterSubscription);
        const matchesEmail = filterEmail === "" || user.email.toLowerCase().includes(filterEmail.toLowerCase());
    
        return matchesStatus && matchesSubscription && matchesEmail;
    })
    .sort((a, b) => {
       
        if (a.isActive !== b.isActive) {
            return a.isActive ? -1 : 1;
        }
        
        return a.name.localeCompare(b.name);
    });
            
    return (
        <div>
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : allUsers.length  >= 0? (
                <div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        <div className="flex gap-2 mb-4 justify-center">
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border px-3 py-1 rounded-lg">
                                <option value="">Todos</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>

                            <select 
                                value={filterSubscription} 
                                onChange={(e) => setFilterSubscription(e.target.value)}
                                className="border px-3 py-1 rounded-lg">
                                <option value="">Todas las suscripciones</option>
                                <option value="premium">Premium</option>
                                <option value="free">Free</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Buscar por email"
                                value={filterEmail}
                                onChange={(e) => setFilterEmail(e.target.value)}
                                className="border px-3 py-1 rounded-lg w-44"
                            />
                        </div>

                        {/* tabla usuarios */}
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-[#b9c4a4]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                N°
                                            </th>
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
                                        {filteredUsers?.map((user: IUsers,index) => (
                                            <tr key={user.id} className="bg-white border-b border-gray-200 hover:bg-[#eeedeb73]">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    {index + 1}
                                                </th>
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    {user.name}
                                                </th>
                                                <td className="px-6 py-2">{user.email}</td>
                                                <td className="px-6 py-2 text-center">{user.subscriptionType}</td>
                                                <td className="px-6 py-2 flex items-center gap-3">
                                                    <span
                                                        className={`w-3 h-3 rounded-full  ${user.isActive === true ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    ></span>
                                                    {user.role !== "admin" && (
                                                        <button onClick={() => handleUserStatus(user.id, user.isActive)}
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

export default UsersListView;
