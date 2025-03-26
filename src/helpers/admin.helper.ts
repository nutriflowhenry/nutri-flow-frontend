import { IPostList, IUsers,IUsersPayments,IUsersStatistics } from "@/types";

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

export async function getUserStatistics(token:string):Promise<IUsersStatistics> {
    try{
        const allUsers = await getAllUsers(token);
        const filteredUsers = allUsers.filter(user => user.role !== "admin" && user.isActive === true);
        const userStadistics = {
            usersNumber: filteredUsers.length,
            premiumUsers: filteredUsers.filter(user => user.subscriptionType === "premium").length,
            freeUsers: filteredUsers.filter(user => user.subscriptionType === "free").length  
        };
        return userStadistics;

    } catch (error) {
        console.error("Error al obtener las estidicas de los usuarios", error);
        throw error;
    }
}
    
export async function banUser(token: string, id:string) {
    try {
        await fetch(`${APIURL}/users/${id}/ban`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("No se pudo banear el usuario", error);
        throw error;
    }
}

export async function activateUser(token: string, id:string) {
    try {
        await fetch(`${APIURL}/users/${id}/unban`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("Error al activar la cuenta:", error);
        throw error;
    }
}

export async function getAllPayments(token: string,page = 1, limit = 10): Promise<IUsersPayments> {
    try {
        const response = await fetch(`${APIURL}/payments/all?limit=${limit}&page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("No se pudo obtener la información de los pagos de los usuarios");
        }
    } catch (error) {
        console.error("Error al obtener los datos de los pagos de los usuarios:", error);
        throw error;
    }
}

export async function getAllPost(token: string,page = 1, limit = 10): Promise<IPostList> {
    try {
        const response = await fetch(`${APIURL}/post/all?limit=${limit}&page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("No se pudo obtener la información de las publicaciones de los usuarios");
        }
    } catch (error) {
        console.error("Error al obtener los datos de las publicaciones de los usuarios:", error);
        throw error;
    }
}

export async function banPost(token: string, id:string) {
    try {
        await fetch(`${APIURL}/post/ban/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("No se pudo banear el post", error);
        throw error;
    }
}

export async function activatePost(token: string, id:string) {
    try {
        await fetch(`${APIURL}/post/activate/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("No se pudo aprobar el post", error);
        throw error;
    }
}