import { IRegisterProps, IUserSession, IloginProps,IUserProfile } from "@/types"

const APIURL = process.env.NEXT_PUBLIC_API_URL; 

export async function register(userData: IRegisterProps) {
    console.log("register manual",userData);
    try{
        const response = await fetch(`${APIURL}/auth/signup`,{
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(userData)
        }) 

        if(response.ok){
            return response.json()
        } else {
            alert("The new user register have failed")
        }
        
    } catch (error:any){
        alert("The new user register have failed")
        throw new Error(error)
    }
};

export async function validateGoogleToken(googleToken: string) {
    console.log("funcion registro con google")
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
            throw new Error("Google authentication failed");
        }
    } catch (error: any) {
        console.error("Google registration error:", error);
        throw new Error(error);
    }
}

export async function login(userData: IloginProps): Promise<IUserSession> {
    try {
        // Autenticar al usuario y obtener el token
        const {token} = await getSessionToken(userData); 
        
        if (!token) throw new Error("No se recibió un token");

        // Obtener los datos del usuario con el token
        const user = await getCurrentUser(token);

        if (!user) throw new Error("No se pudo obtener la información del usuario");

        console.log("Usuario autenticado:", user);

        // Intentar obtener el perfil del usuario, pero no lanzar error si no existe
        let profileData: IUserProfile | undefined;
        try {
            profileData = await fetchUserProfile(token);
            console.log("DATOOOS:", profileData);
        } catch (error) {
            console.warn("No se pudo obtener el perfil del usuario:", error);
            // No lanzar error, el perfil es opcional
        }

        return { token, user, profileData };

    } catch (error) {
        console.error("Error en login con email:", error);
        throw error;
    }
};

export async function getSessionToken(userData: IloginProps) {
    try {
        const response = await fetch(`${APIURL}/auth/login`, {
            method:'POST',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if(response.ok) {
            return response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error de inicio de sesión");
        }
    }catch (error: any) {
        throw new Error(error.message || "Error inesperado");
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