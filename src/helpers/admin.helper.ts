import { IUsers } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllUsers(token: string): Promise<IUsers[]> {
    try {
        const response = await fetch(`${APIURL}/users/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("No se pudo obtener la información de los usuarios");
        }
    } catch (error) {
        console.error("Error al obtener los datos de los usuarios:", error);
        throw error;
    }
}

export async function banUser(token: string, id:string) {
    try {
        const response = await fetch(`${APIURL}/users/${id}/ban`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("No se pudo banear el usuario ");
        }
    } catch (error) {
        console.error("Error al obtener los datos de los usuarios:", error);
        throw error;
    }
}
