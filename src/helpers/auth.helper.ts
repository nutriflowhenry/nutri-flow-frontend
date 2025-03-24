import { IRegisterProps, IUserSession, IloginProps } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function register(userData: IRegisterProps) {
    try {
        const response = await fetch(`${APIURL}/auth/signup`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(userData)
        })

        if (response.ok) {
            return response.json()
        } else {
            alert("The new user register have failed")
        }

    } catch (error) {
        alert("The new user register have failed")
        throw error;
    }
};

export async function validateGoogleToken(googleToken: string) {
    try {
        const response = await fetch(`${APIURL}/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: googleToken }),
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorData = await response.json();
            if (response.status === 401 && errorData.message === "User account is inactive!") {
                throw new Error("inactive_account");
            } else {
                throw new Error(errorData.message || "Error de autenticación con Google.");
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error; // Lanza el error para que sea manejado en el componente
        } else {
            throw new Error("Ocurrió un error desconocido durante la autenticación con Google.");
        }
    }
}

export async function login(userData: IloginProps): Promise<IUserSession> {
    try {
        // Autenticar al usuario y obtener el token
        const { token } = await getSessionToken(userData);

        if (!token) throw new Error("No se recibió un token");

        // Obtener los datos del usuario con el token
        const user = await getCurrentUser(token);

        if (!user) throw new Error("No se pudo obtener la información del usuario");

        return { token, user };

    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "User account is inactive!") {
                throw new Error("Tu cuenta está inactiva. Por favor, contacta al soporte.");
            } else {
                throw new Error("Credenciales incorrectas o error en el servidor.");
            }
        } else {
            throw new Error("Ocurrió un error desconocido.");
        }
    }
};

export async function getSessionToken(userData: IloginProps) {
    try {
        const response = await fetch(`${APIURL}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error de inicio de sesión");
        }
    } catch (error) {
        throw error;
    }
};

export async function getCurrentUser(token: string) {
    try {
        const response = await fetch(`${APIURL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("No se pudo obtener la información del usuario");
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        throw error;
    }
}

export async function fetchUserProfile(token: string) {
    try {
        const response = await fetch(`${APIURL}/user-profiles`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json(); // Extrae la respuesta completa
            return data.userProfile; // Devuelve solo userProfile
        }

        if (response.status === 404) {
            console.info("Perfil de usuario no encontrado, esto es normal para usuarios nuevos.");
            return null; // Devuelve null si el perfil no existe, evitando el error
        }

        throw new Error("No se pudo obtener la información del usuario");
    } catch (error) {
        console.warn("No se pudo obtener el perfil del usuario:", error);
        return null;
    }
}

//<------- PASARELA DE PAGOS -------->

// Crear una sesión de pago
export async function handleSubscription(token: string) {
    try {
        const response = await fetch(`${APIURL}/payments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear la sesión de pago:', error);
        throw error;
    }
};

// Cancelar suscripción
export async function handleCancelSubscription(token: string) {
    try {
        const response = await fetch(`${APIURL}/payments`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cancelar la suscripción:', error);
        throw error;
    }
};

// Obtener pagos del usuario
export async function fetchUserPayments(token: string,page: number = 1, limit: number = 10) {
    try {
        const response = await fetch(`${APIURL}/payments?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        throw error;
    }
};