'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/helpers/auth.helper";
import Cookies from 'js-cookie';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

const DashboardView = () => {

    const { logout } = useAuth();
    const { status } = useSession();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Obtener la sesión del usuario desde las cookies
                const userSession = Cookies.get("token");
                if (!userSession) {
                    throw new Error("No se encontró la sesión del usuario");
                }

                // Obtener el token de la sesión
                const token = JSON.parse(userSession).token;
                if (!token) {
                    throw new Error("No hay token de autenticación");
                }
                // Obtener los datos del usuario
                console.log("este es el token",token)
                const userInfo = await getCurrentUser(token);
                setUser(userInfo);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [status, router]);

    if (loading) {
        return <p className="text-gray-700">Cargando...</p>;
    }

    if (error) {
        return <p className="text-gray-700">Error: {error}</p>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg ">
            <h1 className="text-2xl font-bold mb-4 text-black">Perfil de Usuario</h1>
            {user ? (
                <div className="text-black">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Creado el:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Actualizado el:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                    <button
                        onClick={logout}
                        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            ) : (
                <div className="text-black">
                    <p >No se encontraron datos del usuario.</p>

                </div>
            )}
        </div>
    );
};


export default DashboardView;