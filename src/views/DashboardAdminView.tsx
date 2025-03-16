'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { IUsers } from '@/types';
import { banUser, getAllUsers } from '@/helpers/admin.helper';
import Swal from 'sweetalert2';
import UsersList from '@/components/UsersList';


const DashboardAdminView = () => {
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
                setAllUsers(usersTable);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userData?.token]);

    if (loading) {
        return <p className="text-gray-700 text-center py-8">Cargando...</p>;
    }

    return (
        <div className="p-6 mx-10 bg-white shadow-md rounded-lg mt-8 max-w-full">
            <h1 className="text-2xl font-bold mb-6 text-black text-center">¡Hola {userData?.user.name}!</h1>
                <div>
                    <UsersList/>
                </div>
        </div>
    );
};

export default DashboardAdminView;