import { IRegisterProps, IUserSession, IloginProps } from "@/types"
import Swal from "sweetalert2";

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

export async function registerWithGoogle(googleToken: string) {
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

export async function login(userData: IloginProps) {
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